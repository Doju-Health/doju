import * as SelectPrimitive from "@radix-ui/react-select";
import React from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./select";
import { Label } from "../label";
import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import { Button } from "../button";

interface SelectOptions {
  label?: React.ReactNode;
  value?: string;
}

interface CustomSelectProps extends SelectPrimitive.SelectProps {
  placeholder?: string;
  icon?: React.ReactElement;
  options: SelectOptions[];
  triggerClassName?: string;
  labelClassName?: string;
  groupClassName?: string;
  isRequired?: boolean;
  align?: "center" | "end" | "start" | undefined;
  hasSeparator?: boolean;
  label?: string;
  error?: string | boolean;
  [key: string]: any;
}

export const CustomSelect = ({
  placeholder = "Select field",
  icon,
  triggerClassName,
  groupClassName,
  labelClassName,
  isRequired = true,
  align,
  label,
  hasSeparator = false,
  options,
  error,
  ...props
}: CustomSelectProps) => {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", groupClassName)}>
      {label && (
        <Label className={cn("font-light", labelClassName)}>
          {label}
          {isRequired && (
            <span className="ml-1 mb-3 h-0 text-sm leading-none text-red-600">
              *
            </span>
          )}
        </Label>
      )}
      <Select {...props}>
        <div className={groupClassName}>
          <div className="relative">
            <SelectTrigger
              icon={
                props?.isFilter ? (
                  <ChevronDown
                    className={cn("size-4", props?.value && "hidden")}
                  />
                ) : (
                  <ChevronDown
                    className={cn("size-4", props?.value && "hidden")}
                  />
                )
              }
              className={cn(
                "min-w-32 gap-2 bg-whit shadow-none hover:border-primary h-9!",
                triggerClassName,
                error && "border-destructive",
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            {props?.value && (
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onValueChange?.("");
                }}
                variant="ghost"
                className="!p-0 absolute right-3 top-1/2 -translate-y-1/2 z-10 hover:bg-transparent"
              >
                <X className="size-4 cursor-pointer" />
              </Button>
            )}
          </div>

          <SelectContent align={align}>
            {options?.map((item, index) => (
              <SelectItem
                key={`select-item-${index}`}
                value={item.value as string}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </div>
      </Select>
      {error && <small className="mt-1 text-destructive">{error}</small>}
    </div>
  );
};

// import * as SelectPrimitive from "@radix-ui/react-select";
// import React from "react";
// import {
//   Select,
//   SelectContent,
//   SelectTrigger,
//   SelectValue,
//   SelectItem,
// } from "./select";
// import { Label } from "../label";
// import { cn } from "@/utils/helpers";
// import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
// import { Button } from "../button";

// interface SelectOptions {
//   label?: React.ReactNode;
//   value?: string;
// }

// interface CustomSelectProps extends SelectPrimitive.SelectProps {
//   placeholder?: string;
//   icon?: React.ReactElement;
//   options: SelectOptions[];
//   triggerClassName?: string;
//   labelClassName?: string;
//   groupClassName?: string;
//   isRequired?: boolean;
//   align?: "center" | "end" | "start" | undefined;
//   hasSeparator?: boolean;
//   label?: string;
//   error?: string | boolean;
//   [key: string]: any;
// }

// export const CustomSelect = ({
//   placeholder = "Select field",
//   icon,
//   triggerClassName,
//   groupClassName,
//   labelClassName,
//   isRequired,
//   align,
//   label,
//   hasSeparator = false,
//   options,
//   error,
//   ...props
// }: CustomSelectProps) => {
//   return (
//     <div className={cn("flex w-full flex-col gap-1.5", groupClassName)}>
//       {label && (
//         <Label className={cn("font-light", labelClassName)}>
//           {label}
//           {isRequired && (
//             <span className="-ml-1 mb-3 h-0 text-sm leading-none text-red-600">
//               *
//             </span>
//           )}
//         </Label>
//       )}
//       <Select {...props}>
//         <div className={groupClassName}>
//           <div className="relative">
//             <SelectTrigger
//               icon={
//                 props?.isFilter ?
//                 <SlidersHorizontal className={cn("size-4", props?.value && "hidden")} />
//                 :
//                 <ChevronDown className={cn("size-4", props?.value && "hidden")} />
//               }
//               className={cn("min-w-32 gap-2 bg-white", triggerClassName, error && "border-destructive")}
//             >
//               <SelectValue placeholder={placeholder} />
//             </SelectTrigger>
//             {props?.value && (
//               <Button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   props.onValueChange?.("");
//                 }}
//                 variant="ghost"
//                 className="!p-0 absolute right-3 top-1/2 -translate-y-1/2 z-10"
//               >
//                 <X className="size-4 cursor-pointer" />
//               </Button>
//             )}
//           </div>

//           <SelectContent align={align}>
//             {options?.map((item, index) => (
//               <SelectItem
//                 key={`select-item-${index}`}
//                 value={item.value as string}
//               >
//                 {item.label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </div>
//       </Select>
//       {error && <small className="mt-1 text-destructive">{error}</small>}
//     </div>
//   );
// }
