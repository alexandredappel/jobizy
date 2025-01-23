import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { JobType, WorkArea, Language } from "@/types/firebase.types";
import { CheckCircle2 } from "lucide-react";

const JOB_TYPES: JobType[] = [
  'Waiter', 'Cook', 'Cashier', 'Manager', 'Housekeeper', 
  'Gardener', 'Pool guy', 'Bartender', 'Seller'
];

const WORK_AREAS: WorkArea[] = [
  'Seminyak', 'Kuta', 'Kerobokan', 'Canggu', 'Umalas', 'Ubud', 
  'Uluwatu', 'Denpasar', 'Sanur', 'Jimbaran', 'Pererenan', 'Nusa Dua'
];

const LANGUAGES: Language[] = ['English', 'Bahasa'];

interface OnboardingData {
  job: JobType;
  location: WorkArea[];
  languages: Language[];
  full_name: string;
  gender: "male" | "female";
  phone_number: string;
  email: string;
  password: string;
}

const WorkerOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    job: 'Waiter',
    location: [],
    languages: [],
    full_name: "",
    gender: "male",
    phone_number: "",
    email: "",
    password: "",
  });

  const progress = (step / 6) * 100;

  const handleNext = async () => {
    if (step === 6) {
      await completeOnboarding();
    } else {
      setStep(step + 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      setIsCompleting(true);
      
      // Create Firebase auth user
      const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        ...data,
        role: 'worker',
        availability_status: true,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });

      toast({
        title: "Profile Created",
        description: "Your profile is now visible to businesses in Bali!",
      });

      setTimeout(() => {
        navigate("/worker/dashboard");
      }, 3000);

    } catch (error: any) {
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
          <h1 className="text-2xl font-bold">Congratulations!</h1>
          <p className="text-muted-foreground">
            Your profile is now visible to professionals in Bali.
            Redirecting to your dashboard...
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
                <h2 className="text-2xl font-bold">What job are you looking for?</h2>
                <Select
                  value={data.job}
                  onValueChange={(value: JobType) => setData({ ...data, job: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job" />
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

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">In which areas would you like to work?</h2>
                <ToggleGroup 
                  type="multiple"
                  value={data.location}
                  onValueChange={(value) => setData({ ...data, location: value as WorkArea[] })}
                  className="flex flex-wrap gap-2"
                >
                  {WORK_AREAS.map((area) => (
                    <ToggleGroupItem
                      key={area}
                      value={area}
                      aria-label={area}
                      className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                      {area}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">What languages do you speak?</h2>
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
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Tell us about yourself</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={data.full_name}
                      onChange={(e) => setData({ ...data, full_name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <RadioGroup
                      value={data.gender}
                      onValueChange={(value: "male" | "female") => 
                        setData({ ...data, gender: value })}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">What's your phone number?</h2>
                <Input
                  type="tel"
                  value={data.phone_number}
                  onChange={(e) => setData({ ...data, phone_number: e.target.value })}
                  placeholder="Enter your phone number"
                />
                <p className="text-sm text-muted-foreground">
                  Your phone number is required for businesses to contact you about job opportunities.
                </p>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Create your account</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData({ ...data, password: e.target.value })}
                      placeholder="Create a password"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button 
              className="w-full mt-8" 
              onClick={handleNext}
              disabled={
                (step === 1 && !data.job) ||
                (step === 2 && data.location.length === 0) ||
                (step === 3 && data.languages.length === 0) ||
                (step === 4 && (!data.full_name || !data.gender)) ||
                (step === 5 && !data.phone_number) ||
                (step === 6 && (!data.email || !data.password))
              }
            >
              {step === 6 ? "Complete" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerOnboarding;