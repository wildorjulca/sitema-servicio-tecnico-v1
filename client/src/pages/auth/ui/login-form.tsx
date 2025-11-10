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
import InfoErroMessage from "../../../components/alert-message/alerts";
import Loader from "../../../components/sniper-carga/loader";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/authService";
import { useUser } from "@/hooks/useUser";

// ✅ Esquema de validación con Zod
const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "El nombre de usuario debe tener al menos 2 caracteres." }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const { mutate, isPending, data, error } = useLogin(); // 👈 uso isPending en lugar de isLoading
  const { setUser } = useUser(); // 👈 contexto
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(
      { usuario: values.username, password: values.password },
      {
        onSuccess: (response) => {
          if (!response.ok || !response.data) return;

          // Guardar usuario y token en contexto
          setUser(response.data,response.token || "");

          // Opcional: guardar token en localStorage
          localStorage.setItem("token", response.token || "");

          // Redirigir al dashboard
          navigate("/dashboard");
        },
      }
    );
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="flex items-center">
          <CardTitle className="text-2xl">Inforsystem Computer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Usuario */}
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

            {/* Campo Contraseña */}
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

            {/* Mensajes de error */}
            {error && <InfoErroMessage title=" Fallo al Iniciar Secionq" />}
            {data && !data.ok && (
              <InfoErroMessage title={data.message || "Error en el login"} />
            )}

            {/* Botones */}
            <div className="space-y-3">
              <Button
                className="w-full flex items-center justify-center gap-2 bg-[#256093] dark:bg-gray-500"
                disabled={isPending}
              >
                {isPending && <Loader />}
                Iniciar sesión
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
