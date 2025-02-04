import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslatedConstants } from "@/hooks/useTranslatedConstants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { JobType, WorkArea, Language } from "@/types/firebase.types";
import { JOB_TYPES, LANGUAGES } from "@/utils/constants";
import { CheckCircle2 } from "lucide-react";

const WORK_AREAS: WorkArea[] = [
  'Seminyak', 'Kuta', 'Kerobokan', 'Canggu', 'Umalas', 'Ubud', 
  'Uluwatu', 'Denpasar', 'Sanur', 'Jimbaran', 'Pererenan', 'Nusa Dua'
];

type ContractType = 'Full time' | 'Part time';

interface OnboardingData {
  job: JobType;
  location: WorkArea[];
  languages: Language[];
  type_contract: ContractType;
  full_name: string;
  gender: "male" | "female";
  phone_number: string;
}

const WorkerOnboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { translateJob, translateLanguage } = useTranslatedConstants();
  const [step, setStep] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    job: 'WAITER',
    location: [],
    languages: [],
    type_contract: 'Full time',
    full_name: "",
    gender: "male",
    phone_number: "",
  });

  const progress = (step / 6) * 100;

  const validatePhoneNumber = (number: string) => {
    const cleanNumber = number.replace('+62', '').replace(/^0+/, '');
    return cleanNumber.length >= 8 && cleanNumber.length <= 12;
  };

  const formatPhoneNumber = (number: string) => {
    let cleaned = number.replace('+62', '').replace(/^0+/, '');
    return cleaned;
  };

  const handleNext = async () => {
    if (step === 6) {
      await completeOnboarding();
    } else {
      setStep(step + 1);
    }
  };

  const completeOnboarding = async () => {
    if (!user?.id) return;

    try {
      setIsCompleting(true);
      
      await setDoc(doc(db, 'users', user.id), {
        ...data,
        role: 'worker',
        availability_status: true,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
        phone_number: `+62${formatPhoneNumber(data.phone_number)}`,
      });

      toast({
        title: t('worker.onboarding.completion.toast.success.title'),
        description: t('worker.onboarding.completion.toast.success.description'),
      });

      setTimeout(() => {
        navigate("/worker/dashboard");
      }, 3000);

    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: t('worker.onboarding.completion.toast.error.title'),
        description: t('worker.onboarding.completion.toast.error.description'),
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
          <h1 className="text-2xl font-bold">{t('worker.onboarding.completion.title')}</h1>
          <p className="text-muted-foreground">
            {t('worker.onboarding.completion.description')}
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
                <h2 className="text-2xl font-bold">{t('worker.onboarding.steps.job.title')}</h2>
                <Select
                  value={data.job}
                  onValueChange={(value: JobType) => setData({ ...data, job: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('worker.onboarding.steps.job.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((job) => (
                      <SelectItem key={job} value={job}>
                        {translateJob(job)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{t('worker.onboarding.steps.workAreas.title')}</h2>
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
                <h2 className="text-2xl font-bold">{t('worker.onboarding.steps.languages.title')}</h2>
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
                      {translateLanguage(language)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{t('worker.onboarding.steps.contract.title')}</h2>
                <Select
                  value={data.type_contract}
                  onValueChange={(value: ContractType) => setData({ ...data, type_contract: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('worker.onboarding.steps.contract.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full time">
                      {t('worker.onboarding.steps.contract.types.fullTime')}
                    </SelectItem>
                    <SelectItem value="Part time">
                      {t('worker.onboarding.steps.contract.types.partTime')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">{t('worker.onboarding.steps.personal.title')}</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">{t('worker.onboarding.steps.personal.fullName.label')}</Label>
                    <Input
                      id="fullName"
                      value={data.full_name}
                      onChange={(e) => setData({ ...data, full_name: e.target.value })}
                      placeholder={t('worker.onboarding.steps.personal.fullName.placeholder')}
                    />
                  </div>
                  <div>
                    <Label>{t('worker.onboarding.steps.personal.gender.label')}</Label>
                    <RadioGroup
                      value={data.gender}
                      onValueChange={(value: "male" | "female") => 
                        setData({ ...data, gender: value })}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">
                          {t('worker.onboarding.steps.personal.gender.male')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">
                          {t('worker.onboarding.steps.personal.gender.female')}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{t('worker.onboarding.steps.phone.title')}</h2>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">+62</span>
                  </div>
                  <Input
                    type="tel"
                    value={data.phone_number}
                    onChange={(e) => {
                      const value = formatPhoneNumber(e.target.value);
                      setData({ ...data, phone_number: value });
                    }}
                    className="pl-12"
                    placeholder={t('worker.onboarding.steps.phone.placeholder')}
                  />
                </div>
                {data.phone_number && !validatePhoneNumber(data.phone_number) && (
                  <p className="text-sm text-destructive">
                    {t('worker.onboarding.steps.phone.validation')}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {t('worker.onboarding.steps.phone.description')}
                </p>
              </div>
            )}

            <Button 
              className="w-full mt-8" 
              onClick={handleNext}
              disabled={
                (step === 1 && !data.job) ||
                (step === 2 && data.location.length === 0) ||
                (step === 3 && data.languages.length === 0) ||
                (step === 4 && !data.type_contract) ||
                (step === 5 && (!data.full_name || !data.gender)) ||
                (step === 6 && !data.phone_number)
              }
            >
              {step === 6 ? t('worker.onboarding.navigation.complete') : t('worker.onboarding.navigation.next')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerOnboarding;
