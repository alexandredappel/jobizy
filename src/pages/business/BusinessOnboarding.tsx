import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BusinessType, WorkArea, JobType, Language } from "@/types/firebase.types";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BUSINESS_TYPES: BusinessType[] = ['Restaurant', 'Hotel', 'Property Management', 'Guest House', 'Club'];
const WORK_AREAS: WorkArea[] = [
  'Seminyak', 'Kuta', 'Kerobokan', 'Canggu', 'Umalas', 'Ubud', 
  'Uluwatu', 'Denpasar', 'Sanur', 'Jimbaran', 'Pererenan', 'Nusa Dua'
];
const JOB_TYPES: JobType[] = [
  'Waiter', 'Cook', 'Cashier', 'Manager', 'Housekeeper', 
  'Gardener', 'Pool Maintenance', 'Bartender', 'Seller'
];
const LANGUAGES: Language[] = ['English', 'Bahasa'];

interface OnboardingData {
  business_type: BusinessType;
  location: WorkArea;
  job_type: JobType;
  languages: Language[];
  company_name: string;
}

const BusinessOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    business_type: 'Restaurant',
    location: 'Seminyak',
    job_type: 'Waiter',
    languages: [],
    company_name: "",
  });

  const progress = (step / 5) * 100;

  const handleNext = async () => {
    if (step === 5) {
      await completeOnboarding();
    } else {
      setStep(step + 1);
    }
  };

  const completeOnboarding = async () => {
    if (!user?.id) return;

    try {
      setIsCompleting(true);
      console.log("Completing business onboarding...");
      
      await setDoc(doc(db, 'users', user.id), {
        business_type: data.business_type,
        location: data.location,
        company_name: data.company_name,
        role: 'business',
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });

      toast({
        title: "Profile Created",
        description: "Your business profile has been created successfully!",
      });

      // Redirect to search page after successful onboarding
      setTimeout(() => {
        navigate("/business/search");
      }, 3000);

    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to create your profile. Please try again.",
        variant: "destructive",
      });
      setIsCompleting(false);
    }
  };

  if (isCompleting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <CheckCircle2 className="mx-auto h-16 w-16 text-primary animate-bounce" />
          <h1 className="text-2xl font-bold">Welcome aboard!</h1>
          <p className="text-muted-foreground">
            Your business profile has been created.
            Redirecting to search page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6">
          <Progress value={progress} className="mb-8" />
          
          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">What is your Business Type?</h2>
                <Select
                  value={data.business_type}
                  onValueChange={(value: BusinessType) => setData({ ...data, business_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Where is your business located?</h2>
                <Select
                  value={data.location}
                  onValueChange={(value: WorkArea) => setData({ ...data, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_AREAS.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">What kind of worker are you looking for?</h2>
                <Select
                  value={data.job_type}
                  onValueChange={(value: JobType) => setData({ ...data, job_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((job) => (
                      <SelectItem key={job} value={job}>
                        {job}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">What languages should the worker speak?</h2>
                <ToggleGroup 
                  type="multiple"
                  value={data.languages}
                  onValueChange={(value) => setData({ ...data, languages: value as Language[] })}
                  className="flex flex-wrap gap-2"
                >
                  {LANGUAGES.map((language) => (
                    <ToggleGroupItem
                      key={language}
                      value={language}
                      aria-label={language}
                      className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                      {language}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <div className="flex flex-wrap gap-2 mt-4">
                  {data.languages.map((lang) => (
                    <Badge key={lang} variant="secondary">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">What is the name of your Business?</h2>
                <Input
                  value={data.company_name}
                  onChange={(e) => setData({ ...data, company_name: e.target.value })}
                  placeholder="Enter your business name"
                />
              </div>
            )}

            <Button 
              className="w-full mt-8" 
              onClick={handleNext}
              disabled={
                (step === 1 && !data.business_type) ||
                (step === 2 && !data.location) ||
                (step === 3 && !data.job_type) ||
                (step === 4 && data.languages.length === 0) ||
                (step === 5 && !data.company_name)
              }
            >
              {step === 5 ? "Complete" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessOnboarding;
