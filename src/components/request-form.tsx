
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Check, Minus, Plus, Eye } from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DEAL_TYPES, TRADE_CLASSES } from "../utils/constants";
import { saveRequest } from "../utils/request-utils";

const RequestForm = () => {
  const navigate = useNavigate();
  const initialFormState = {
    dealType: "",
    material: "",
    costCenter: "",
    validityStart: undefined as Date | undefined,
    validityEnd: undefined as Date | undefined,
    discount: 0,
    availableBudget: "",
    totalEstimatedCost: "",
    searchOutlet: "",
    classOfTrade: "",
    salesArea: "",
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateSelectMode, setDateSelectMode] = useState<"start" | "end">("start");
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (dateSelectMode === "start") {
      setFormData((prev) => ({ 
        ...prev, 
        validityStart: date,
        // If end date is before start date, set end date to start date + 30 days
        validityEnd: prev.validityEnd && date && prev.validityEnd < date 
          ? addDays(date, 30) 
          : prev.validityEnd
      }));
      if (date) {
        setDateSelectMode("end");
      }
    } else {
      setFormData((prev) => ({ ...prev, validityEnd: date }));
      setIsDatePickerOpen(false);
    }
  };

  const handleDiscountChange = (increment: boolean) => {
    setFormData((prev) => ({
      ...prev,
      discount: increment 
        ? Math.min(prev.discount + 1, 100) 
        : Math.max(prev.discount - 1, 0)
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      "dealType", 
      "material", 
      "costCenter", 
      "validityStart",
      "validityEnd",
      "availableBudget", 
      "totalEstimatedCost", 
      "searchOutlet", 
      "classOfTrade", 
      "salesArea"
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert dates to ISO strings for storage
      const requestData = {
        ...formData,
        validityStart: formData.validityStart ? formData.validityStart.toISOString() : '',
        validityEnd: formData.validityEnd ? formData.validityEnd.toISOString() : '',
      };
      
      // Save request to localStorage
      const savedRequest = saveRequest(requestData);
      
      toast.success("Request created successfully");
      setSubmittedRequestId(savedRequest.id);
      
      // Reset form after successful submission
      setFormData(initialFormState);
      setDateSelectMode("start");
      
    } catch (error) {
      console.error("Error saving request:", error);
      toast.error("Failed to create request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulate = () => {
    if (!validateForm()) {
      return;
    }
    
    toast.info("Simulation in progress...");
    
    // Simulate API request
    setTimeout(() => {
      toast.success("Simulation complete. Estimated profitability: +15%");
    }, 1500);
  };

  const handleViewRequests = () => {
    navigate("/my-requests");
  };

  const formFields = [
    {
      id: "dealType",
      label: "Deal Type",
      type: "select",
      required: true,
      options: DEAL_TYPES,
      colSpan: 1,
    },
    {
      id: "material",
      label: "Material",
      type: "text",
      required: true,
      placeholder: "Enter material",
      colSpan: 1,
    },
    {
      id: "costCenter",
      label: "Cost Center",
      type: "text",
      required: true,
      placeholder: "Enter cost center",
      colSpan: 1,
    },
    {
      id: "validityPeriod",
      label: "Validity Period",
      type: "daterange",
      required: true,
      colSpan: 1,
    },
    {
      id: "discount",
      label: "Discount (Rs.)",
      type: "number",
      required: true,
      colSpan: 1,
    },
    {
      id: "availableBudget",
      label: "Available Budget",
      type: "text",
      required: true,
      placeholder: "Enter available budget",
      colSpan: 1,
    },
    {
      id: "totalEstimatedCost",
      label: "Total Estimated Cost",
      type: "text",
      required: true,
      placeholder: "Enter estimated cost",
      colSpan: 1,
    },
    {
      id: "searchOutlet",
      label: "Search Outlet",
      type: "text",
      required: true,
      placeholder: "Search outlet",
      colSpan: 1,
    },
    {
      id: "classOfTrade",
      label: "Class of Trade",
      type: "select",
      required: true,
      options: TRADE_CLASSES,
      colSpan: 1,
    },
    {
      id: "salesArea",
      label: "Sales Area",
      type: "text",
      required: true,
      placeholder: "Enter sales area",
      colSpan: 2,
    },
  ];

  const getDateRangeText = () => {
    if (formData.validityStart && formData.validityEnd) {
      return `${format(formData.validityStart, "yyyy-MM-dd")} to ${format(formData.validityEnd, "yyyy-MM-dd")}`;
    }
    if (formData.validityStart) {
      return `From ${format(formData.validityStart, "yyyy-MM-dd")}`;
    }
    return "Select date range";
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-bold text-hawk mb-2">Create New Request</h1>
        <p className="text-gray-500">Fill in the details below to submit a new request</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={`space-y-2 ${field.colSpan === 2 ? 'md:col-span-2' : ''}`}
          >
            <label htmlFor={field.id} className="hawk-label flex items-center">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === "select" ? (
              <Select
                value={formData[field.id as keyof typeof formData] as string}
                onValueChange={(value) => handleSelectChange(field.id, value)}
              >
                <SelectTrigger className="hawk-input w-full">
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === "daterange" ? (
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <button
                    id={field.id}
                    type="button"
                    className={cn(
                      "hawk-input w-full text-left flex items-center justify-between",
                      !formData.validityStart && !formData.validityEnd && "text-muted-foreground"
                    )}
                  >
                    {getDateRangeText()}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">
                        {dateSelectMode === "start" ? "Select start date" : "Select end date"}
                      </h4>
                      <Tabs value={dateSelectMode} onValueChange={(v) => setDateSelectMode(v as "start" | "end")}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="start">Start</TabsTrigger>
                          <TabsTrigger value="end">End</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <Calendar
                      mode="single"
                      selected={dateSelectMode === "start" ? formData.validityStart : formData.validityEnd}
                      onSelect={handleDateChange}
                      initialFocus
                      disabled={
                        dateSelectMode === "end" && formData.validityStart
                          ? { before: formData.validityStart }
                          : undefined
                      }
                      className="p-3 pointer-events-auto"
                    />
                    <div className="flex justify-between mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDatePickerOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          if (dateSelectMode === "start" && formData.validityStart) {
                            setDateSelectMode("end");
                          } else {
                            setIsDatePickerOpen(false);
                          }
                        }}
                      >
                        {dateSelectMode === "start" ? "Next" : "Apply"}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : field.type === "number" ? (
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleDiscountChange(false)}
                  className="hawk-input flex items-center justify-center w-10 rounded-r-none border-r-0"
                >
                  <Minus size={16} />
                </button>
                <input
                  id={field.id}
                  name={field.id}
                  type="text"
                  className="hawk-input flex-1 text-center rounded-none"
                  value={formData.discount}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => handleDiscountChange(true)}
                  className="hawk-input flex items-center justify-center w-10 rounded-l-none border-l-0"
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.id as keyof typeof formData] as string}
                onChange={handleInputChange}
                className="hawk-input w-full"
                required={field.required}
              />
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
      >
        <button
          type="submit"
          className="hawk-button hawk-button-primary h-11 px-8 text-base font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Submit Request"
          )}
        </button>
        
        <button
          type="button"
          onClick={handleSimulate}
          className="hawk-button bg-white/10 text-white hover:bg-white/20 h-11 px-8 text-base font-medium"
          disabled={isSubmitting}
        >
          Simulate
        </button>
        
        {submittedRequestId && (
          <Button
            type="button"
            onClick={handleViewRequests}
            variant="outline"
            className="h-11 px-8 text-base font-medium flex gap-2 items-center"
          >
            <Eye size={16} /> View Requests
          </Button>
        )}
      </motion.div>
    </form>
  );
};

export default RequestForm;
