'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface QueueFormProps {
  role: "student" | "ta"
}

const studentFormSchema = z.object({
  ubit: z.string().min(1, "Enter a valid UBIT Name").max(10),
  name: z.string().min(1, "Enter a valid name").max(20),
  issue: z.string().min(1, "Enter a valid reason").max(100),
})

const taFormSchema = z.object({
  ubit: z.string().min(1, "Enter a valid UBIT Name").max(10),
  name: z.string().min(1, "Enter a valid name").max(20),
  resolution: z.string().min(1, "Enter a valid resolution").max(100),
})

const schemaMap = {
  student: studentFormSchema,
  ta: taFormSchema,
}

const schema = z.union([studentFormSchema, taFormSchema])

export const QueueForm: React.FC<QueueFormProps> = ({role}) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ubit: "",
      name: "",
      issue: "",
      resolution: "",
    },
  })

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* UBIT */}
        <FormField
          control={form.control}
          name="ubit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UBIT</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter your UBIT" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role-Specific Field */}
        {role === "student" ? (
          <FormField
            control={form.control}
            name="issue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Describe your issue" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="resolution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resolution</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Describe the resolution" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
