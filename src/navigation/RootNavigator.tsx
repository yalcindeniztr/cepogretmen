import React from 'react';
import { useApp } from '../core/context/AppContext';
import { Navbar } from '../components/common/Navbar';
import { DashboardView } from '../features/dashboard/DashboardView';
import { PlanListView } from '../features/plans/PlanListView';
import { LibraryView } from '../features/library/LibraryView';
import { EvaluationView } from '../features/evaluation/EvaluationView';
import { MaarifAssistantView } from '../features/assistant/MaarifAssistantView';
import { SettingsView } from '../features/settings/SettingsView';
import { PlanEditorModal } from '../features/plans/PlanEditorModal';
import { ExamListView } from '../features/exams/ExamListView';
import { ExamEditorModal } from '../features/exams/ExamEditorModal';
import { VoiceVisualizer } from '../components/speech/VoiceVisualizer';

export const RootNavigator: React.FC = () => {
  const {
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
  } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            settings={settings}
            plans={plans}
            libraryItems={libraryItems}
            scales={scales}
            reminders={reminders}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectPlan={(plan) => {
              setSelectedPlan(plan);
              setIsEditorOpen(true);
            }}
          />
        );
      case 'yearly':
        return (
          <PlanListView
            planType="YEARLY"
            plans={plans}
            settings={settings}
            onOpenCreate={() => openNewPlanModal('YEARLY')}
            onSelectPlan={(plan) => {
              setSelectedPlan(plan);
              setIsEditorOpen(true);
            }}
            onDeletePlan={deletePlan}
          />
        );
      case 'daily':
        return (
          <PlanListView
            planType="DAILY"
            plans={plans}
            settings={settings}
            onOpenCreate={() => openNewPlanModal('DAILY')}
            onSelectPlan={(plan) => {
              setSelectedPlan(plan);
              setIsEditorOpen(true);
            }}
            onDeletePlan={deletePlan}
          />
        );
      case 'exams':
        return (
          <ExamListView
            exams={exams}
            settings={settings}
            onOpenCreate={openNewExamModal}
            onSelectExam={(exam) => {
              setSelectedExam(exam);
              setIsExamModalOpen(true);
            }}
            onDeleteExam={deleteExam}
            onSaveExam={saveExam}
          />
        );
      case 'library':
        return (
          <LibraryView
            items={libraryItems}
            onAddItem={addLibraryItem}
            onDeleteItem={deleteLibraryItem}
          />
        );
      case 'scales':
        return (
          <EvaluationView
            scales={scales}
            settings={settings}
            onAddScale={addScale}
          />
        );
      case 'assistant':
        return <MaarifAssistantView settings={settings} />;
      case 'settings':
        return (
          <SettingsView
            settings={settings}
            onUpdateSettings={updateSettings}
            onDataReload={reloadAllData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-maarif-500 selection:text-white font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onVoiceReminder={triggerVoiceReminder}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderActiveScreen()}
      </main>

      <PlanEditorModal
        isOpen={isEditorOpen}
        plan={selectedPlan}
        initialType={editorInitialType}
        settings={settings}
        onClose={() => setIsEditorOpen(false)}
        onSave={savePlan}
      />

      <ExamEditorModal
        isOpen={isExamModalOpen}
        exam={selectedExam}
        settings={settings}
        onClose={() => setIsExamModalOpen(false)}
        onSave={saveExam}
      />

      <VoiceVisualizer
        isSpeaking={isSpeaking}
        isListening={isListening}
        onStopSpeaking={stopSpeaking}
        onStopListening={stopListening}
      />

      {/* Footer */}
      <footer className="mt-auto py-6 bg-white/70 border-t border-slate-200/80 text-center text-xs text-slate-500">
        <p>
          Türkiye Yüzyılı Maarif Modeli Tarih Dersi Planlama ve Yönetim Sistemi •{' '}
          <strong>{settings.schoolName}</strong>
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Öğretmen: {settings.teacherName} • Müdür: {settings.principalName} • Tüm veriler yerel bilgisayarınızda güvendedir.
        </p>
      </footer>
    </div>
  );
};
