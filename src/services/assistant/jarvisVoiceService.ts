import { AppSettings, PlanItem, ExamPaper, EvaluationScale, MebCalendarReminder } from '../../core/types';
import { SpeechService } from '../speech/speechService';
import { MEB_WORK_CALENDAR_WEEKS } from '../../core/constants/mebWorkCalendar';

export interface JarvisBriefingData {
  teacherTitle: string;
  schoolName: string;
  currentDateStr: string;
  estimatedWeek: number;
  upcomingEventTitle: string;
  upcomingEventAction: string;
  yearlyPlanCount: number;
  dailyPlanCount: number;
  examCount: number;
  scaleCount: number;
  speechScript: string;
}

export class JarvisVoiceService {
  /**
   * Generates a context-aware, highly intelligent Jarvis-style briefing
   * for the History Teacher based on MEB calendar and current app stats.
   */
  static generateBriefing(
    settings: AppSettings,
    plans: PlanItem[],
    exams: ExamPaper[] = [],
    scales: EvaluationScale[] = [],
    reminders: MebCalendarReminder[] = []
  ): JarvisBriefingData {
    const yearlyCount = plans.filter((p) => p.type === 'YEARLY').length;
    const dailyCount = plans.filter((p) => p.type === 'DAILY').length;
    const examCount = exams.length;
    const scaleCount = scales.length;

    const today = new Date();
    const dateStr = today.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    });

    // Approximate MEB week based on month
    // September = week 1-3, October = week 4-7, November = week 8-11, etc.
    const month = today.getMonth(); // 0-11
    let estWeek = 1;
    if (month === 8) estWeek = 2; // Sept
    else if (month === 9) estWeek = 6; // Oct
    else if (month === 10) estWeek = 9; // Nov (Exam 1 & Midterm)
    else if (month === 11) estWeek = 14; // Dec
    else if (month === 0) estWeek = 18; // Jan (Term end)
    else if (month === 1) estWeek = 21; // Feb
    else if (month === 2) estWeek = 25; // Mar
    else if (month === 3) estWeek = 29; // Apr
    else if (month === 4) estWeek = 33; // May
    else if (month === 5) estWeek = 36; // June

    const upcomingReminder = reminders.find((r) => r.isUrgent) || reminders[0] || {
      title: 'Tarih Zümre ve Ortak Sınav Hazırlığı',
      dateStr: 'Ekim - Kasım Dönemi',
      actionRequired: 'Açık uçlu sınav soruları ve 2 dönemli plan kontrolü'
    };

    const teacherFirstName = settings.teacherName.split(' ')[0] || 'Öğretmenim';

    // Script with charismatic Jarvis cadence
    const speechScript = `Sayın ${settings.teacherName} Hocam, ${settings.schoolName} Maarif Komuta Merkezi aktif. Bugün ${dateStr}. MEB Çalışma Takvimi doğrultusunda sistemleriniz incelendi: Sistemde ${yearlyCount} adet 2 Dönemli Yıllık Plan, ${dailyCount} adet Günlük Ders Planı ve ${examCount} adet Açık Uçlu Sınav kaydı bulunmaktadır. Yaklaşan en önemli takvim maddesi: ${upcomingReminder.title}. Tavsiye edilen işlem: ${upcomingReminder.actionRequired}. Türkiye Yüzyılı Maarif Modeli kazanımları ve Zümre Karar Tutanakları hazır durumdadır. Tüm işlemleriniz için emrinizdeyim Hocam.`;

    return {
      teacherTitle: settings.teacherName,
      schoolName: settings.schoolName,
      currentDateStr: dateStr,
      estimatedWeek: estWeek,
      upcomingEventTitle: upcomingReminder.title,
      upcomingEventAction: upcomingReminder.actionRequired,
      yearlyPlanCount: yearlyCount,
      dailyPlanCount: dailyCount,
      examCount,
      scaleCount,
      speechScript
    };
  }

  /**
   * Speaks the briefing aloud using SpeechService
   */
  static playBriefing(
    script: string,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    onStart?.();
    SpeechService.speak(script, onEnd);
  }

  static stopBriefing(): void {
    SpeechService.stopSpeaking();
  }

  static isSpeaking(): boolean {
    return SpeechService.isSpeaking();
  }
}
