import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, PlanItem, LibraryItem, EvaluationScale, MebCalendarReminder, PlanType, ExamPaper } from '../types';
import { LocalDatabaseService } from '../../services/storage/localDatabase';
import { ActiveTab } from '../../components/common/Navbar';
import { SpeechService } from '../../services/speech/speechService';

interface AppContextType {
  settings: AppSettings;
  plans: PlanItem[];
  libraryItems: LibraryItem[];
  scales: EvaluationScale[];
  exams: ExamPaper[];
  reminders: MebCalendarReminder[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedPlan: PlanItem | null;
  setSelectedPlan: (plan: PlanItem | null) => void;
  selectedExam: ExamPaper | null;
  setSelectedExam: (exam: ExamPaper | null) => void;
  isEditorOpen: boolean;
  setIsEditorOpen: (open: boolean) => void;
  isExamModalOpen: boolean;
  setIsExamModalOpen: (open: boolean) => void;
  editorInitialType: PlanType;
  setEditorInitialType: (type: PlanType) => void;
  updateSettings: (newSettings: AppSettings) => void;
  savePlan: (plan: PlanItem) => void;
  deletePlan: (id: string) => void;
  saveExam: (exam: ExamPaper) => void;
  deleteExam: (id: string) => void;
  addLibraryItem: (item: LibraryItem) => void;
  deleteLibraryItem: (id: string) => void;
  addScale: (scale: EvaluationScale) => void;
  reloadAllData: () => void;
  openNewPlanModal: (type: PlanType) => void;
  openNewExamModal: () => void;
  triggerVoiceReminder: () => void;
  isSpeaking: boolean;
  isListening: boolean;
  stopSpeaking: () => void;
  stopListening: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => LocalDatabaseService.getSettings());
  const [plans, setPlans] = useState<PlanItem[]>(() => LocalDatabaseService.getPlans());
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(() => LocalDatabaseService.getLibraryItems());
  const [scales, setScales] = useState<EvaluationScale[]>(() => LocalDatabaseService.getScales());
  const [exams, setExams] = useState<ExamPaper[]>(() => LocalDatabaseService.getExams());
  const [reminders, setReminders] = useState<MebCalendarReminder[]>(() => LocalDatabaseService.getReminders());

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [selectedExam, setSelectedExam] = useState<ExamPaper | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editorInitialType, setEditorInitialType] = useState<PlanType>('YEARLY');

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const reloadAllData = () => {
    setSettings(LocalDatabaseService.getSettings());
    setPlans(LocalDatabaseService.getPlans());
    setLibraryItems(LocalDatabaseService.getLibraryItems());
    setScales(LocalDatabaseService.getScales());
    setExams(LocalDatabaseService.getExams());
    setReminders(LocalDatabaseService.getReminders());
  };

  const updateSettings = (newSettings: AppSettings) => {
    LocalDatabaseService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const savePlan = (plan: PlanItem) => {
    LocalDatabaseService.addOrUpdatePlan(plan);
    setPlans(LocalDatabaseService.getPlans());
  };

  const deletePlan = (id: string) => {
    LocalDatabaseService.deletePlan(id);
    setPlans(LocalDatabaseService.getPlans());
  };

  const saveExam = (exam: ExamPaper) => {
    LocalDatabaseService.saveExam(exam);
    setExams(LocalDatabaseService.getExams());
  };

  const deleteExam = (id: string) => {
    LocalDatabaseService.deleteExam(id);
    setExams(LocalDatabaseService.getExams());
  };

  const addLibraryItem = (item: LibraryItem) => {
    LocalDatabaseService.addLibraryItem(item);
    setLibraryItems(LocalDatabaseService.getLibraryItems());
  };

  const deleteLibraryItem = (id: string) => {
    LocalDatabaseService.deleteLibraryItem(id);
    setLibraryItems(LocalDatabaseService.getLibraryItems());
  };

  const addScale = (scale: EvaluationScale) => {
    LocalDatabaseService.addScale(scale);
    setScales(LocalDatabaseService.getScales());
  };

  const openNewPlanModal = (type: PlanType) => {
    setSelectedPlan(null);
    setEditorInitialType(type);
    setIsEditorOpen(true);
  };

  const openNewExamModal = () => {
    setSelectedExam(null);
    setIsExamModalOpen(true);
  };

  const triggerVoiceReminder = () => {
    const urgentReminder = reminders.find(r => r.isUrgent) || reminders[0];
    if (urgentReminder) {
      setIsSpeaking(true);
      const speech = `Sayın Hocam, ${urgentReminder.title} için hatırlatmanız var. ${urgentReminder.description}. Yapılması gereken işlem: ${urgentReminder.actionRequired}`;
      SpeechService.speak(speech, () => setIsSpeaking(false));
    }
  };

  const stopSpeaking = () => {
    SpeechService.stopSpeaking();
    setIsSpeaking(false);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        plans,
        libraryItems,
        scales,
        exams,
        reminders,
        activeTab,
        setActiveTab,
        selectedPlan,
        setSelectedPlan,
        selectedExam,
        setSelectedExam,
        isEditorOpen,
        setIsEditorOpen,
        isExamModalOpen,
        setIsExamModalOpen,
        editorInitialType,
        setEditorInitialType,
        updateSettings,
        savePlan,
        deletePlan,
        saveExam,
        deleteExam,
        addLibraryItem,
        deleteLibraryItem,
        addScale,
        reloadAllData,
        openNewPlanModal,
        openNewExamModal,
        triggerVoiceReminder,
        isSpeaking,
        isListening,
        stopSpeaking,
        stopListening
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
