"use client"

import { useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, type Category, type Expense } from "@/lib/types";
import { parseExpenseFromText } from "@/lib/actions";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/hooks/use-data";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  description: z.string().min(1, "Description is required."),
  amount: z.coerce.number().gt(0, "Amount must be a positive number."),
  category: z.enum(categories, { required_error: "Category is required." }),
  date: z.date({ required_error: "Date is required." }),
});

type FormValues = z.infer<typeof formSchema>;

export function AddExpenseDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isParsing, setIsParsing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const { toast } = useToast();
  const { addExpense } = useData();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      date: new Date(),
    },
  });

  const handleParseExpense = async () => {
    if (textInput.length < 3) return;
    setIsParsing(true);
    try {
      const result = await parseExpenseFromText(textInput);
      if (result) {
        form.setValue("description", result.description);
        form.setValue("amount", result.amount);
        if (categories.includes(result.category as Category)) {
          form.setValue("category", result.category as Category);
        }
      }
    } catch (error) {
      toast({ variant: 'destructive', title: "AI Parsing Failed", description: "Could not understand the expense details." });
    } finally {
      setIsParsing(false);
    }
  };

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        const newExpense: Omit<Expense, 'id'> = {
            ...values,
            date: values.date.toISOString(),
        };
        await addExpense(newExpense);
        toast({ title: "Expense Added", description: "Your expense has been successfully recorded." });
        setOpen(false);
        form.reset();
        setTextInput("");
      } catch (error) {
        toast({ variant: 'destructive', title: "Error", description: "Failed to add expense." });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Expense with AI</DialogTitle>
          <DialogDescription>
            Describe your expense in one sentence and let AI handle the rest.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expense-text">Describe your expense</Label>
            <Textarea
              id="expense-text"
              placeholder="e.g., 'Weekly groceries for $120.75'"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </div>
          <Button onClick={handleParseExpense} disabled={isParsing || textInput.length < 3} className="w-full">
            {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analyze with AI
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 border-t">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Coffee with a friend" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Category
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Expense
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
