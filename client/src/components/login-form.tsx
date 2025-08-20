import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authenticateUser } from "@/services/authService";
import { useState, useTransition } from "react";
import InfoErroMessage from "./alert-message/alerts";
import Loader from "./sniper-carga/loader";

// Definir el esquema de validación con Zod
const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "El nombre de usuario debe tener al menos 2 caracteres." }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [messageErrors, setmessageErrors] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  // Inicializar el formulario con validación
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handler del submit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, password } = values;

    try {
      // Realiza la operación asíncrona fuera de startTransition
      const response = await authenticateUser(username, password);

      // Maneja la actualización de estado dentro de startTransition
      startTransition(() => {
        if (!response?.ok) {
          setmessageErrors(response?.message);
          return;
        }
        setmessageErrors("");
        console.log(response);
      });
    } catch (error) {
      console.error("Unexpected error during submission:", error);
      setmessageErrors("An unexpected error occurred.");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="flex items-center">
          <CardTitle className="text-2xl">Inforsystem Computer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo de Nombre de usuario */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Usuario
              </label>
              <Input
                id="username"
                placeholder="Tu nombre de usuario"
                {...form.register("username")}
              />
              <p className="text-sm text-red-500">
                {form.formState.errors.username?.message}
              </p>
            </div>

            {/* Campo de Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                {...form.register("password")}
              />
              <p className="text-sm text-red-500">
                {form.formState.errors.password?.message}
              </p>
            </div>

            {messageErrors && <InfoErroMessage title={messageErrors} />}

            {/* Botones */}
            <div className="space-y-3">
              <Button
                className="w-full flex items-center justify-center gap-2 bg-[#256093] dark:bg-gray-500"
                disabled={isPending}
              >
                {isPending && (
                  <Loader /> // Puedes usar cualquier spinner
                )}
                Iniciar sesión
              </Button>
              <Button variant="outline" className="w-full">
                Iniciar sesión con email
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
