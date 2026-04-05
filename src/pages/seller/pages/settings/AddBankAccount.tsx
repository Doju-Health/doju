import { useState, useEffect, useMemo, useRef } from "react";
import {
  ChevronsUpDown,
  Check,
  Loader2,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useGetBanks } from "../../api/use-get-banks";
import { useVerifyBank } from "../../api/use-verify-bank";
import { useAddBankInfo } from "../../api/use-add-bank-info";

interface Bank {
  id: number;
  name: string;
  code: string;
}

interface AddBankAccountProps {
  existingBankCode?: string | null;
  existingAccountNumber?: string | null;
  existingAccountName?: string | null;
}

export default function AddBankAccount({
  existingBankCode,
  existingAccountNumber,
  existingAccountName,
}: AddBankAccountProps) {
  const [open, setOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [verifiedAccountName, setVerifiedAccountName] = useState("");
  const [search, setSearch] = useState("");

  // Prevents the auto-verify effect from clearing the pre-filled account name
  const skipNextVerifyRef = useRef(false);
  const prefillAppliedRef = useRef(false);

  const { data: banks = [], isLoading: banksLoading } = useGetBanks();

  const filteredBanks = useMemo(() => {
    const list = banks as Bank[];
    if (!search.trim()) return list;
    const lower = search.toLowerCase();
    return list.filter((b) => b.name.toLowerCase().includes(lower));
  }, [banks, search]);

  const verifyBank = useVerifyBank();
  const addBankInfo = useAddBankInfo();

  const isAccountNumberComplete = accountNumber.length === 10;

  // Prefill from existing bank data once banks list is loaded
  useEffect(() => {
    if (
      !existingBankCode ||
      !existingAccountNumber ||
      !existingAccountName ||
      !(banks as Bank[]).length ||
      prefillAppliedRef.current
    )
      return;
    const match = (banks as Bank[]).find((b) => b.code === existingBankCode);
    if (match) {
      prefillAppliedRef.current = true;
      skipNextVerifyRef.current = true;
      setSelectedBank(match);
      setAccountNumber(existingAccountNumber);
      setVerifiedAccountName(existingAccountName);
    }
  }, [banks, existingBankCode, existingAccountNumber, existingAccountName]);

  // Auto-verify when both bank and 10-digit account number are set
  useEffect(() => {
    if (skipNextVerifyRef.current) {
      skipNextVerifyRef.current = false;
      return;
    }
    if (!selectedBank || !isAccountNumberComplete) {
      setVerifiedAccountName("");
      return;
    }

    verifyBank.mutate(
      { accountNumber, bankCode: selectedBank.code },
      {
        onSuccess: (data) => {
          setVerifiedAccountName(data?.data?.account_name ?? "");
        },
        onError: () => {
          setVerifiedAccountName("");
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountNumber, selectedBank]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank || !verifiedAccountName) return;

    addBankInfo.mutate(
      {
        accountNumber,
        bankCode: selectedBank.code,
        accountName: verifiedAccountName,
      },
      {
        onSuccess: () => {
          prefillAppliedRef.current = false;
          setSelectedBank(null);
          setAccountNumber("");
          setVerifiedAccountName("");
        },
      },
    );
  };

  const canSubmit =
    !!selectedBank &&
    isAccountNumberComplete &&
    !!verifiedAccountName &&
    !verifyBank.isPending &&
    !addBankInfo.isPending;

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1 — Bank */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                1
              </span>
              <Label className="text-sm font-medium">Select Bank</Label>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between font-normal h-11"
                  disabled={banksLoading}
                >
                  {banksLoading ? (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading banks…
                    </span>
                  ) : selectedBank ? (
                    <span className="font-medium">{selectedBank.name}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      Search and select your bank
                    </span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search bank…"
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No bank found.</CommandEmpty>
                    <CommandGroup>
                      {filteredBanks.map((bank) => (
                        <CommandItem
                          key={bank.id}
                          value={String(bank.id)}
                          onSelect={() => {
                            setSelectedBank(bank);
                            setVerifiedAccountName("");
                            setSearch("");
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedBank?.id === bank.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {bank.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Step 2 — Account number */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                  selectedBank
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                2
              </span>
              <Label
                htmlFor="accountNumber"
                className={cn(
                  "text-sm font-medium",
                  !selectedBank && "text-muted-foreground",
                )}
              >
                Account Number
              </Label>
            </div>
            <Input
              id="accountNumber"
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit account number"
              value={accountNumber}
              disabled={!selectedBank}
              className="h-11"
              onChange={(e) =>
                setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />
            {isAccountNumberComplete &&
              !verifyBank.isPending &&
              !verifiedAccountName &&
              verifyBank.isError && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Could not verify account. Check the number and try again.
                </p>
              )}
          </div>

          {/* Step 3 — Account name (auto) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                  verifiedAccountName
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                3
              </span>
              <Label
                htmlFor="accountName"
                className={cn(
                  "text-sm font-medium",
                  !verifiedAccountName && "text-muted-foreground",
                )}
              >
                Account Name
              </Label>
              {verifiedAccountName && (
                <BadgeCheck className="h-4 w-4 text-green-500 ml-auto" />
              )}
            </div>
            <div className="relative">
              <Input
                id="accountName"
                type="text"
                value={verifiedAccountName}
                readOnly
                placeholder={
                  verifyBank.isPending
                    ? "Verifying account…"
                    : "Auto-filled after verification"
                }
                className={cn(
                  "h-11 pr-10 cursor-not-allowed",
                  verifiedAccountName
                    ? "bg-green-50 border-green-200 text-green-800 font-medium dark:bg-green-950/20 dark:border-green-800 dark:text-green-300"
                    : "bg-muted text-muted-foreground",
                )}
              />
              {verifyBank.isPending && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {verifiedAccountName && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-doju-lime"
            disabled={!canSubmit}
          >
            {addBankInfo.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving bank account…
              </span>
            ) : existingAccountNumber ? (
              "Update Bank Account"
            ) : (
              "Save Bank Account"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
