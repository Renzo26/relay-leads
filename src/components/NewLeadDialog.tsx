import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateLead } from "@/hooks/useLeads";
import { SOURCE_LABEL } from "@/lib/lead-format";
import type { CreateLeadInput, LeadSource } from "@/types/lead";

interface FormValues extends CreateLeadInput {}

export function NewLeadDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const create = useCreateLead();
  const [source, setSource] = useState<LeadSource>("site");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { source: "site" } });

  const onSubmit = (values: FormValues) => {
    if (!values.email && !values.phone) {
      toast.error("Informe pelo menos email ou telefone.");
      return;
    }
    create.mutate(
      { ...values, source },
      {
        onSuccess: () => {
          toast.success("Lead criada com sucesso.");
          reset();
          setSource("site");
          onOpenChange(false);
        },
        onError: (e: Error) => toast.error(e.message),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Lead</DialogTitle>
          <DialogDescription>
            Crie uma nova lead. O contacto é reutilizado se já existir.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              {...register("name", { required: "Nome é obrigatório" })}
              placeholder="Nome completo"
            />
            {errors.name && (
              <p className="text-xs text-danger">{errors.name.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="email@exemplo.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" {...register("phone")} placeholder="+351 ..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Origem *</Label>
              <Select value={source} onValueChange={(v) => setSource(v as LeadSource)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(SOURCE_LABEL) as LeadSource[]).map((s) => (
                    <SelectItem key={s} value={s}>{SOURCE_LABEL[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="campaign">Campanha</Label>
              <Input id="campaign" {...register("campaign")} placeholder="Opcional" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea id="message" {...register("message")} rows={3} placeholder="Notas / pedido do cliente" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "A criar..." : "Criar lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
