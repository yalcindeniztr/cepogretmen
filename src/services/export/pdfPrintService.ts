import { PlanItem, AppSettings, EvaluationScale, ExamPaper, ExamItemAnalysis, PerformanceTaskItem, FullTwoTermYearlyPlan } from '../../core/types';

export class PdfPrintService {
  /**
   * Opens an official formatted printable A4 window.
   * If DAILY: combines all 3 sections of Maarif Model (Ders Bilgisi/Programlar Arası, Öğrenme Çıktıları/Kanıtları, Öğrenme-Öğretme Yaşantıları).
   * If YEARLY: uses landscape MEB Work Calendar table with weekly hours.
   */
  static printPlan(plan: PlanItem, settings: AppSettings): void {
    const isDaily = plan.type === 'DAILY';

    const printWindow = window.open('', '_blank', 'width=1100,height=850');
    if (!printWindow) {
      alert('Yazdırma penceresi açılamadı. Lütfen tarayıcınızın pop-up engelleyicisini kapatın.');
      return;
    }

    const htmlContent = isDaily
      ? this.generateDailyPlanHtml(plan, settings)
      : this.generateYearlyPlanHtml(plan, settings);

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  /**
   * Generates HTML for 3-Section Maarif Model Daily Plan
   */
  private static generateDailyPlanHtml(plan: PlanItem, settings: AppSettings): string {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>${plan.gradeLevel}. Sınıf Tarih Günlük Planı - ${plan.weekNumber}. Hafta</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          * { box-sizing: border-box; font-family: 'Times New Roman', Times, serif; }
          body { margin: 0; padding: 10px; color: #000; background: #fff; font-size: 10pt; line-height: 1.35; }
          .title-box { text-align: center; margin-bottom: 10px; }
          .title-box h2 { margin: 2px 0; font-size: 13pt; font-weight: bold; }
          .title-box h3 { margin: 2px 0; font-size: 12pt; font-weight: bold; color: #1f4e79; }
          .maarif-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          .maarif-table th, .maarif-table td {
            border: 1px solid #5b9bd5;
            padding: 6px 8px;
            font-size: 9.5pt;
            vertical-align: top;
          }
          .section-header {
            background-color: #c6d9a7;
            font-weight: bold;
            font-size: 10.5pt;
            text-align: left;
            padding: 5px 8px;
            color: #000;
          }
          .lbl {
            background-color: #f2f2f2;
            font-weight: bold;
            width: 24%;
          }
          .val {
            background-color: #ffffff;
          }
          .bullet-list { margin: 2px 0; padding-left: 16px; }
          .bullet-list li { margin-bottom: 3px; }
          .signature-table { width: 100%; border-collapse: collapse; margin-top: 20px; border: none; }
          .signature-table td { border: none; text-align: center; width: 50%; padding: 10px; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 12px; padding: 8px 12px; background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <span><strong>Maarif Modeli Resmi Günlük Ders Planı Şablonu:</strong> Doğrudan yazdırabilir veya PDF olarak kaydedebilirsiniz.</span>
          <button onclick="window.print()" style="background: #0c8ce9; color: white; border: none; padding: 6px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🖨️ Yazdır / PDF Kaydet
          </button>
        </div>

        <div class="title-box">
          <h2>${settings.schoolName.toUpperCase()}</h2>
          <h2>${plan.gradeLevel}. SINIF TARİH DERSİ GÜNLÜK PLANI</h2>
          <h3>${plan.weekNumber}. HAFTA (${plan.dateRange})</h3>
        </div>

        <table class="maarif-table">
          <!-- BÖLÜM 1: DERS BİLGİSİ -->
          <tr>
            <td colspan="4" class="section-header">DERS BİLGİSİ</td>
          </tr>
          <tr>
            <td class="lbl">Sınıf</td>
            <td class="val" style="width: 36%;">${plan.gradeLevel}. SINIF</td>
            <td class="lbl" style="width: 15%;">Ders</td>
            <td class="val" style="width: 25%;">${plan.subject || 'TARİH'}</td>
          </tr>
          <tr>
            <td class="lbl">Tema</td>
            <td class="val"><strong>${plan.themeUnit}</strong></td>
            <td class="lbl">Süre</td>
            <td class="val"><strong>${plan.lessonHours || 2} Ders Saati</strong></td>
          </tr>
          <tr>
            <td class="lbl">Alan Becerileri</td>
            <td colspan="3" class="val">${plan.domainSkills || (plan.skills || []).join(', ')}</td>
          </tr>
          <tr>
            <td class="lbl">Kavramsal Beceriler</td>
            <td colspan="3" class="val">${plan.conceptualSkills || 'KB2.4. Çözümleme'}</td>
          </tr>
          <tr>
            <td class="lbl">Eğilimler</td>
            <td colspan="3" class="val">${plan.dispositions || 'E2.1. Empati, E3.2. Odaklanma, E3.6. Analitiklik Düşünme'}</td>
          </tr>

          <!-- PROGRAMLAR ARASI BİLEŞENLER -->
          <tr>
            <td colspan="4" class="section-header">PROGRAMLAR ARASI BİLEŞENLER</td>
          </tr>
          <tr>
            <td class="lbl">Sosyal-Duygusal Öğr. Bec.</td>
            <td colspan="3" class="val">${plan.socialEmotionalSkills || 'SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme'}</td>
          </tr>
          <tr>
            <td class="lbl">Değerler</td>
            <td colspan="3" class="val"><strong>${plan.values.join(', ')}</strong></td>
          </tr>
          <tr>
            <td class="lbl">Okuryazarlık Becerileri</td>
            <td colspan="3" class="val">${plan.literacySkills || 'OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık'}</td>
          </tr>
          <tr>
            <td class="lbl">Disiplinler Arası İlişki</td>
            <td colspan="3" class="val">${plan.interdisciplinaryRelations || 'Coğrafya, Felsefe, Matematik, Sosyoloji'}</td>
          </tr>
          <tr>
            <td class="lbl">Beceriler Arası İlişki</td>
            <td colspan="3" class="val">${plan.interSkillRelations || 'SBAB2. Kanıta Dayalı Sorgulama ve Araştırma, SBAB2.2. Kaynaklardan Bilgi Toplama, KB3.1. Karar Verme'}</td>
          </tr>

          <!-- BÖLÜM 2: ÖĞRENME ÇIKTILARI, İÇERİK VE KANITLAR -->
          <tr>
            <td class="lbl">Öğrenme Çıktıları ve Süreç Bileşenleri</td>
            <td colspan="3" class="val">
              <ul class="bullet-list">
                ${plan.learningOutcomes.map(o => `<li>${o}</li>`).join('')}
              </ul>
            </td>
          </tr>
          <tr>
            <td class="lbl">İçerik Çerçevesi</td>
            <td colspan="3" class="val"><strong>${plan.contentFramework || plan.topics.join(', ')}</strong></td>
          </tr>
          <tr>
            <td class="lbl">Öğrenme Kanıtları</td>
            <td colspan="3" class="val">
              <div style="white-space: pre-line;">${plan.learningEvidences || plan.evaluation}</div>
            </td>
          </tr>

          <!-- BÖLÜM 3: ÖĞRENME-ÖĞRETME YAŞANTILARI -->
          <tr>
            <td colspan="4" class="section-header">ÖĞRENME-ÖĞRETME YAŞANTILARI</td>
          </tr>
          <tr>
            <td class="lbl">Temel Kabuller</td>
            <td colspan="3" class="val">
              <div style="white-space: pre-line;">${plan.basicAssumptions || '* Öğrencilerin kültürel mirasın aktarılmasında tarihin rolü olduğu bilgisine sahip oldukları kabul edilmektedir.'}</div>
            </td>
          </tr>
          <tr>
            <td class="lbl">Ön Değerlendirme Süreci</td>
            <td colspan="3" class="val">
              <div style="white-space: pre-line;">${plan.preAssessmentProcess || '* Ünite kapsamında öğrencilere rehber sorular yönlendirilir.'}</div>
            </td>
          </tr>
          <tr>
            <td class="lbl">Öğrenme-Öğretme Uygulamaları</td>
            <td colspan="3" class="val">
              <p style="margin: 3px 0;">${plan.processComponents}</p>
              <div style="margin-top: 6px; padding: 4px; background: #fafafa; border-left: 3px solid #5b9bd5;">
                <strong>Farklılaştırma (Zenginleştirme):</strong> ${plan.differentiation.enrichment || 'Arşiv ve müze araştırması.'}<br>
                <strong>Farklılaştırma (Destekleme):</strong> ${plan.differentiation.support || 'Görsel kart eşleştirme.'}
              </div>
            </td>
          </tr>
        </table>

        <table class="signature-table">
          <tr>
            <td>
              <strong>${settings.teacherName}</strong><br>
              Tarih Öğretmeni<br><br>
              İmza: .......................................
            </td>
            <td>
              <strong>UYGUNDUR</strong><br>
              ${new Date().toLocaleDateString('tr-TR')}<br>
              <strong>${settings.principalName}</strong><br>
              Okul Müdürü<br><br>
              Mühür / İmza: .......................................
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  /**
   * Generates HTML for MEB Work Calendar Yearly Plan
   */
  private static generateYearlyPlanHtml(plan: PlanItem, settings: AppSettings): string {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>${settings.schoolName} - Tarih ${plan.gradeLevel}. Sınıf Yıllık Planı</title>
        <style>
          @page { size: A4 landscape; margin: 8mm; }
          * { box-sizing: border-box; font-family: 'Times New Roman', Times, serif; }
          body { margin: 0; padding: 5px; color: #111; background: #fff; font-size: 9.5pt; line-height: 1.25; }
          .header-box { text-align: center; margin-bottom: 8px; }
          .header-box h2 { margin: 2px 0; font-size: 13pt; font-weight: bold; color: #003366; }
          .header-box h3 { margin: 2px 0; font-size: 11pt; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
          th, td { border: 1px solid #444; padding: 5px 6px; font-size: 8.5pt; vertical-align: top; }
          th { background-color: #0c8ce9; color: white; font-weight: bold; text-align: center; }
          .meta-table td { font-size: 9pt; }
          .meta-lbl { background-color: #f0f7ff; font-weight: bold; width: 18%; }
          .signature-table { margin-top: 15px; border: none; }
          .signature-table td { border: none; text-align: center; padding: 8px; }
          ul { margin: 2px 0; padding-left: 14px; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 10px; padding: 8px; background: #e0f2fe; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <span><strong>MEB Çalışma Takvimli Yıllık Plan Yazdırma:</strong> Sayfa ayarını 'Yatay (Landscape)' seçerek PDF olarak kaydedebilirsiniz.</span>
          <button onclick="window.print()" style="background: #0c8ce9; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🖨️ Yazdır / PDF Kaydet
          </button>
        </div>

        <div class="header-box">
          <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI - ${settings.schoolName.toUpperCase()}</h2>
          <h3>TÜRKİYE YÜZYILI MAARİF MODELİ ${plan.gradeLevel}. SINIF TARİH DERSİ YILLIK PLANI</h3>
        </div>

        <table class="meta-table">
          <tr>
            <td class="meta-lbl">Ders / Sınıf / Saat:</td>
            <td>Tarih / ${plan.gradeLevel}. Sınıf • Haftalık <strong>${plan.lessonHours || settings.defaultWeeklyHours || 2} Ders Saati</strong> (Toplam: ${plan.totalYearlyHours || 72} Saat)</td>
            <td class="meta-lbl">Öğretim Yılı:</td>
            <td>${settings.academicYear} (${settings.term})</td>
          </tr>
          <tr>
            <td class="meta-lbl">Tarih Öğretmeni:</td>
            <td>${settings.teacherName}</td>
            <td class="meta-lbl">Hafta / Tarih:</td>
            <td><strong>${plan.weekNumber}. Hafta</strong> (${plan.dateRange})</td>
          </tr>
        </table>

        <table>
          <thead>
            <tr>
              <th style="width: 7%;">TARİH</th>
              <th style="width: 5%;">HAFTA</th>
              <th style="width: 5%;">SAAT</th>
              <th style="width: 10%;">TEMA</th>
              <th style="width: 10%;">İÇERİK ÇERÇEVESİ</th>
              <th style="width: 12%;">ÖĞRENME ÇIKTILARI</th>
              <th style="width: 13%;">SÜREÇ BİLEŞENLERİ</th>
              <th style="width: 9%;">ÖĞRENME BECERİLERİ</th>
              <th style="width: 7%;">DEĞERLER</th>
              <th style="width: 8%;">OKURYAZARLIK BECERİLERİ</th>
              <th style="width: 9%;">ÖLÇME DEĞERLENDİRME</th>
              <th style="width: 5%;">BELİRLİ GÜN ve HAFT.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; font-size: 8pt;">${plan.dateRange}</td>
              <td style="text-align: center; font-weight: bold;">${plan.weekNumber}. Hafta</td>
              <td style="text-align: center; font-weight: bold;">${plan.lessonHours || settings.defaultWeeklyHours || 2} Saat</td>
              <td style="font-weight: bold; color: #003366;">${plan.themeUnit}</td>
              <td><strong>${plan.contentFramework || plan.topics.join(', ')}</strong></td>
              <td>
                <ul style="margin: 0; padding-left: 12px; font-size: 8pt;">
                  ${plan.learningOutcomes.map(o => `<li>${o}</li>`).join('')}
                </ul>
              </td>
              <td>
                <div style="font-size: 8pt; white-space: pre-line;">${plan.processComponents}</div>
              </td>
              <td style="font-size: 7.5pt;">
                ${plan.socialEmotionalSkills || 'SDB1.2. Kendini Düzenleme, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme'}
              </td>
              <td style="font-size: 8pt; font-weight: bold;">${plan.values.join(', ')}</td>
              <td style="font-size: 7.5pt;">
                ${plan.literacySkills || 'OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık'}
              </td>
              <td style="font-size: 7.5pt; white-space: pre-line;">
                ${plan.learningEvidences || plan.evaluation}
              </td>
              <td style="text-align: center; font-weight: bold; color: #800000; font-size: 8pt;">
                ${plan.notes || ''}
              </td>
            </tr>
          </tbody>
        </table>

        <table class="signature-table">
          <tr>
            <td>
              <strong>${settings.teacherName}</strong><br>
              Tarih Öğretmeni<br><br>
              İmza: .......................................
            </td>
            <td>
              <strong>UYGUNDUR</strong><br>
              ${new Date().toLocaleDateString('tr-TR')}<br>
              <strong>${settings.principalName}</strong><br>
              Okul Müdürü<br><br>
              Mühür / İmza: .......................................
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  /**
   * MEB Çalışma Takvimine Uygun TÜM YILLIK PLANI (Çoklu Haftaları) 12 Sütunlu Tek Bir Resmi Çizelge Olarak Yazdırır / PDF Yapar
   */
  static printMultipleYearlyPlans(plans: PlanItem[], settings: AppSettings, grade?: number): void {
    const printWindow = window.open('', '_blank', 'width=1200,height=900');
    if (!printWindow) {
      alert('Yazdırma penceresi açılamadı. Lütfen tarayıcınızın pop-up engelleyicisini kapatın.');
      return;
    }

    const htmlContent = this.generateMultipleYearlyPlansHtml(plans, settings, grade);
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  private static generateMultipleYearlyPlansHtml(plans: PlanItem[], settings: AppSettings, grade?: number): string {
    const sortedPlans = [...plans].sort((a, b) => a.weekNumber - b.weekNumber);
    const targetGrade = grade || sortedPlans[0]?.gradeLevel || 9;
    const weeklyHours = sortedPlans[0]?.lessonHours || settings.defaultWeeklyHours || 2;
    const totalHours = sortedPlans.reduce((acc, p) => acc + (p.lessonHours || weeklyHours), 0);

    const rowsHtml = sortedPlans.map(p => `
      <tr>
        <td style="text-align: center; font-size: 8pt; white-space: nowrap;">${p.dateRange}</td>
        <td style="text-align: center; font-weight: bold; font-size: 8pt;">${p.weekNumber}. Hafta</td>
        <td style="text-align: center; font-weight: bold; font-size: 8pt;">${p.lessonHours || weeklyHours} Saat</td>
        <td style="font-weight: bold; color: #003366; font-size: 8pt;">${p.themeUnit}</td>
        <td style="font-size: 8pt;"><strong>${p.contentFramework || p.topics.join(', ')}</strong></td>
        <td>
          <ul style="margin: 0; padding-left: 10px; font-size: 7.5pt;">
            ${p.learningOutcomes.map(o => `<li>${o}</li>`).join('')}
          </ul>
        </td>
        <td>
          <div style="font-size: 7.5pt; white-space: pre-line;">${p.processComponents || ''}</div>
        </td>
        <td style="font-size: 7pt;">
          <div><strong>Alan:</strong> ${p.domainSkills || 'SBAB1'}</div>
          <div><strong>Kavramsal:</strong> ${p.conceptualSkills || 'KB2.4'}</div>
          <div><strong>Eğilimler:</strong> ${p.dispositions || 'E3.2'}</div>
        </td>
        <td style="font-size: 7.5pt; font-weight: bold; color: #7030a0;">${p.values.join(', ')}</td>
        <td style="font-size: 7pt;">
          ${p.literacySkills || 'OB1, OB2'}
        </td>
        <td style="font-size: 7pt; white-space: pre-line;">
          ${p.learningEvidences || p.evaluation}
        </td>
        <td style="text-align: center; font-weight: bold; color: #800000; font-size: 7.5pt;">
          ${p.notes || ''}
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>${settings.schoolName} - Tarih ${targetGrade}. Sınıf Yıllık Çalışma Planı</title>
        <style>
          @page { size: A4 landscape; margin: 6mm; }
          * { box-sizing: border-box; font-family: 'Times New Roman', Times, serif; }
          body { margin: 0; padding: 5px; color: #111; background: #fff; font-size: 9pt; line-height: 1.2; }
          .header-box { text-align: center; margin-bottom: 6px; }
          .header-box h2 { margin: 1px 0; font-size: 12pt; font-weight: bold; color: #003366; }
          .header-box h3 { margin: 1px 0; font-size: 10.5pt; color: #0c8ce9; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
          th, td { border: 1px solid #444; padding: 4px 5px; font-size: 8pt; vertical-align: top; }
          th { background-color: #0c8ce9; color: white; font-weight: bold; text-align: center; }
          .meta-table td { font-size: 8.5pt; }
          .meta-lbl { background-color: #f0f7ff; font-weight: bold; width: 18%; }
          .signature-table { margin-top: 15px; border: none; page-break-inside: avoid; }
          .signature-table td { border: none; text-align: center; padding: 6px; }
          ul { margin: 1px 0; padding-left: 10px; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
            tr { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 10px; padding: 8px; background: #e0f2fe; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <span><strong>MEB Çalışma Takvimli 12 Sütunlu Yıllık Plan Yazdırma:</strong> Sayfa yönünü 'Yatay (Landscape)' olarak seçiniz.</span>
          <button onclick="window.print()" style="background: #0c8ce9; color: white; border: none; padding: 6px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🖨️ Yazdır / PDF Kaydet
          </button>
        </div>

        <div class="header-box">
          <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI - ${settings.schoolName.toUpperCase()}</h2>
          <h3>TÜRKİYE YÜZYILI MAARİF MODELİ ${targetGrade}. SINIF TARİH DERSİ YILLIK ÇALIŞMA PLANI</h3>
        </div>

        <table class="meta-table">
          <tr>
            <td class="meta-lbl">Ders / Sınıf / Saat:</td>
            <td>Tarih / ${targetGrade}. Sınıf • Haftalık <strong>${weeklyHours} Ders Saati</strong> (Planlanan Toplam: ${totalHours} Saat)</td>
            <td class="meta-lbl">Öğretim Yılı:</td>
            <td>${settings.academicYear} (${settings.term})</td>
          </tr>
          <tr>
            <td class="meta-lbl">Tarih Öğretmeni:</td>
            <td>${settings.teacherName}</td>
            <td class="meta-lbl">Okul Müdürü:</td>
            <td>${settings.principalName}</td>
          </tr>
        </table>

        <table>
          <thead>
            <tr>
              <th style="width: 7%;">TARİH</th>
              <th style="width: 5%;">HAFTA</th>
              <th style="width: 5%;">SAAT</th>
              <th style="width: 10%;">TEMA</th>
              <th style="width: 10%;">İÇERİK ÇERÇEVESİ</th>
              <th style="width: 12%;">ÖĞRENME ÇIKTILARI</th>
              <th style="width: 13%;">SÜREÇ BİLEŞENLERİ</th>
              <th style="width: 9%;">ÖĞRENME BECERİLERİ</th>
              <th style="width: 7%;">DEĞERLER</th>
              <th style="width: 8%;">OKURYAZARLIK BECERİLERİ</th>
              <th style="width: 9%;">ÖLÇME DEĞERLENDİRME</th>
              <th style="width: 5%;">BELİRLİ GÜN ve HAFT.</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <table class="signature-table">
          <tr>
            <td>
              <strong>${settings.teacherName}</strong><br>
              Tarih Öğretmeni<br><br>
              İmza: .......................................
            </td>
            <td>
              <strong>UYGUNDUR</strong><br>
              ${new Date().toLocaleDateString('tr-TR')}<br>
              <strong>${settings.principalName}</strong><br>
              Okul Müdürü<br><br>
              Mühür / İmza: .......................................
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  /**
   * Print evaluation scale
   */
  static printScale(scale: EvaluationScale, settings: AppSettings): void {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert('Yazdırma penceresi açılamadı.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>${scale.title}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          * { box-sizing: border-box; font-family: 'Times New Roman', Times, serif; }
          body { color: #111; font-size: 11pt; line-height: 1.4; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h2 { margin: 2px; font-size: 15pt; }
          .header h3 { margin: 2px; font-size: 13pt; color: #0c8ce9; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #333; padding: 8px; font-size: 10pt; }
          th { background-color: #f1f5f9; text-align: center; }
          .no-print { margin-bottom: 15px; padding: 10px; background: #e0f2fe; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="no-print" style="display: flex; justify-content: space-between; align-items: center;">
          <span>Ölçme-Değerlendirme Ölçeği Yazdırma Modu</span>
          <button onclick="window.print()" style="background: #0c8ce9; color: white; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer;">🖨️ Yazdır / PDF</button>
        </div>
        <div class="header">
          <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI</h2>
          <h3>${settings.schoolName.toUpperCase()}</h3>
          <h4>${scale.title.toUpperCase()}</h4>
        </div>
        <p><strong>Amaç:</strong> ${scale.purpose}</p>
        <p><strong>Yönerge:</strong> ${scale.instructions}</p>

        <table>
          <thead>
            <tr>
              <th style="width: 8%;">No</th>
              <th style="width: 32%;">Değerlendirme Boyutu</th>
              <th style="width: 45%;">Ölçüt / Gösterge</th>
              <th style="width: 15%;">Maks. Puan</th>
            </tr>
          </thead>
          <tbody>
            ${scale.criteria.map((c, i) => `
              <tr>
                <td style="text-align: center;">${i + 1}</td>
                <td><strong>${c.dimension}</strong></td>
                <td>${c.description}</td>
                <td style="text-align: center; font-weight: bold;">${c.maxScore}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 40px; text-align: right;">
          <p><strong>Ders Öğretmeni:</strong> ${settings.teacherName}</p>
          <p>İmza: .......................................</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  /**
   * MEB Açık Uçlu Soru Kağıdı Yazdırma / PDF Çıktısı (A4 Dikey)
   */
  static printExamPaper(exam: ExamPaper, settings: AppSettings): void {
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) {
      alert('Yazdırma penceresi açılamadı. Lütfen tarayıcınızın pop-up engelleyicisini kapatın.');
      return;
    }

    const questionsHtml = exam.questions.map(q => `
      <div class="question-block">
        <div class="q-header">
          <span>
            <strong>SORU ${q.questionNumber}</strong>
            <span style="display: inline-block; font-size: 8pt; font-weight: bold; padding: 1px 6px; border-radius: 4px; margin: 0 4px; background: ${q.difficulty === 'Zor' ? '#fee2e2; color: #991b1b' : q.difficulty === 'Orta' ? '#e0f2fe; color: #075985' : '#dcfce7; color: #166534'};">[${q.difficulty || 'Orta'}${q.cognitiveLevel ? ' • ' + q.cognitiveLevel : ''}]</span>:
            <small style="color: #475569; font-weight: normal;">(${q.learningOutcome})</small>
          </span>
          <span class="q-points">[ ${q.maxPoints} PUAN ]</span>
        </div>

        ${q.contextText ? `
          <div class="context-box">
            <strong>BAĞLAM / TARİHSEL METİN:</strong> <em>${q.contextText}</em>
          </div>
        ` : ''}

        <div class="q-text">${q.questionText}</div>

        <div class="answer-space">
          <div class="answer-line">Cevap: .............................................................................................................................................................................................</div>
          <div class="answer-line">.............................................................................................................................................................................................................</div>
          <div class="answer-line">.............................................................................................................................................................................................................</div>
          <div class="answer-line">.............................................................................................................................................................................................................</div>
        </div>
      </div>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>${settings.schoolName} - Tarih ${exam.gradeLevel}. Sınıf ${exam.examNumber}</title>
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          * { box-sizing: border-box; font-family: 'Times New Roman', Times, serif; }
          body { margin: 0; padding: 5px; color: #000; font-size: 10pt; line-height: 1.3; }
          .header-box { text-align: center; margin-bottom: 8px; border-bottom: 2px solid #003366; padding-bottom: 4px; }
          .header-box h2 { margin: 1px 0; font-size: 12pt; font-weight: bold; color: #003366; }
          .header-box h3 { margin: 1px 0; font-size: 11pt; }
          .header-box h4 { margin: 1px 0; font-size: 10pt; color: #0c8ce9; }
          .student-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
          .student-table td { border: 1px solid #444; padding: 4px 8px; font-size: 9pt; }
          .instructions-box { background: #f8fafc; border: 1px dashed #64748b; padding: 5px 8px; font-size: 8.5pt; margin-bottom: 10px; }
          .question-block { margin-bottom: 14px; page-break-inside: avoid; }
          .q-header { display: flex; justify-content: space-between; align-items: center; background: #f1f5f9; border: 1px solid #cbd5e1; padding: 4px 8px; font-size: 9.5pt; }
          .q-points { font-weight: bold; color: #003366; }
          .context-box { background: #f8fafc; border-left: 3px solid #0c8ce9; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 5px 8px; font-size: 8.5pt; margin: 3px 0 6px 0; }
          .q-text { font-weight: bold; font-size: 9.5pt; margin: 4px 0 6px 0; }
          .answer-space { margin-top: 4px; }
          .answer-line { color: #666; font-size: 8.5pt; line-height: 1.7; letter-spacing: 0.5px; }
          .no-print { margin-bottom: 10px; padding: 8px 12px; background: #e0f2fe; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
          .footer-note { text-align: center; margin-top: 15px; font-size: 9pt; font-weight: bold; color: #475569; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <span><strong>Öğrenci Sınav Kağıdı Yazdırma:</strong> A4 dikey formatında doğrudan çıktı alabilir veya PDF olarak kaydedebilirsiniz.</span>
          <button onclick="window.print()" style="background: #0c8ce9; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🖨️ Yazdır / PDF Kaydet
          </button>
        </div>

        <div class="header-box">
          <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI</h2>
          <h3>${settings.schoolName.toUpperCase()}</h3>
          <h4>${exam.academicYear} EĞİTİM ÖĞRETİM YILI ${exam.term.toUpperCase()} ${exam.gradeLevel}. SINIF TARİH DERSİ ${exam.examNumber.toUpperCase()}</h4>
          <div style="font-size: 8.5pt; color: #555;">(${exam.scenario} - Sınav Süresi: ${exam.durationMinutes} Dakika)</div>
        </div>

        <table class="student-table">
          <tr>
            <td style="width: 45%;"><strong>ADI VE SOYADI:</strong> ...........................................................</td>
            <td style="width: 20%;"><strong>SINIFI / ŞUBESİ:</strong> ${exam.gradeLevel} / .........</td>
            <td style="width: 15%;"><strong>NO:</strong> ..............</td>
            <td style="width: 20%; background: #f1f5f9; text-align: center;"><strong>ALDIĞI PUAN:</strong> ............ / 100</td>
          </tr>
        </table>

        <div class="instructions-box">
          <strong>YÖNERGE:</strong> ${exam.instructions}
        </div>

        ${questionsHtml}

        <div class="footer-note">
          --- Sınavınız Bitmiştir. Başarılar Dileriz! ---
        </div>
        <div style="margin-top: 15px; text-align: right; font-size: 9pt; font-weight: bold;">
          ${settings.teacherName} • Tarih Öğretmeni
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  /**
   * MEB Dereceli Cevap Anahtarı ve Puanlama Rubriği Yazdırma / PDF Çıktısı (A4 Yatay)
   */
  static printExamAnswerKey(exam: ExamPaper, settings: AppSettings): void {
    const printWindow = window.open('', '_blank', 'width=1100,height=850');
    if (!printWindow) {
      alert('Yazdırma penceresi açılamadı. Lütfen tarayıcınızın pop-up engelleyicisini kapatın.');
      return;
    }

    const rowsHtml = exam.questions.map(q => `
      <tr>
        <td style="text-align: center; font-weight: bold; font-size: 9pt;">${q.questionNumber}</td>
        <td style="font-size: 8pt;">
          <div style="margin-bottom: 4px;">
            <span style="font-size: 7.5pt; font-weight: bold; padding: 1px 5px; border-radius: 4px; background: ${q.difficulty === 'Zor' ? '#fee2e2; color: #991b1b; border: 1px solid #fca5a5' : q.difficulty === 'Orta' ? '#e0f2fe; color: #075985; border: 1px solid #7dd3fc' : '#dcfce7; color: #166534; border: 1px solid #86efac'};">
              ${q.difficulty || 'Orta'} ${q.cognitiveLevel ? '(' + q.cognitiveLevel + ')' : ''}
            </span>
          </div>
          <div><strong>Kazanım:</strong> ${q.learningOutcome}</div>
          <div style="color: #475569;"><strong>Alan:</strong> ${q.domainSkill || '-'}</div>
          <div style="color: #475569;"><strong>Kavramsal:</strong> ${q.conceptualSkill || '-'}</div>
          <div style="color: #7c3aed;"><strong>Değer:</strong> ${q.value || '-'}</div>
        </td>
        <td style="font-size: 8pt;">
          <div style="font-weight: bold; color: #003366; margin-bottom: 2px;">Soru: ${q.questionText}</div>
          <div style="color: #15803d; font-weight: bold;">Beklenen Model Cevap:</div>
          <div style="white-space: pre-line; color: #111;">${q.sampleAnswer}</div>
        </td>
        <td style="font-size: 8pt;">
          <ul style="margin: 0; padding-left: 14px; margin-bottom: 4px;">
            ${q.rubricGuide.map(r => `<li>${r.criterion} <strong>[${r.points} Puan]</strong> ${r.partialGuidance ? `<span style="color: #64748b; font-style: italic;">(${r.partialGuidance})</span>` : ''}</li>`).join('')}
          </ul>
          ${q.partialCreditNotes ? `
            <div style="margin-top: 4px; padding: 3px 6px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 4px; color: #92400e; font-size: 7.5pt;">
              <strong>⚠️ Kademeli / Yarım Cevap Değerlendirmesi:</strong> ${q.partialCreditNotes}
            </div>
          ` : ''}
        </td>
        <td style="text-align: center; font-weight: bold; font-size: 9pt; color: #b91c1c;">
          ${q.maxPoints} Puan
        </td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>${settings.schoolName} - Tarih ${exam.gradeLevel}. Sınıf Cevap Anahtarı</title>
        <style>
          @page { size: A4 landscape; margin: 8mm; }
          * { box-sizing: border-box; font-family: 'Times New Roman', Times, serif; }
          body { margin: 0; padding: 5px; color: #000; font-size: 9pt; line-height: 1.25; }
          .header-box { text-align: center; margin-bottom: 8px; border-bottom: 2px solid #003366; padding-bottom: 4px; }
          .header-box h2 { margin: 1px 0; font-size: 12pt; font-weight: bold; color: #003366; }
          .header-box h3 { margin: 1px 0; font-size: 10.5pt; color: #0c8ce9; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
          th, td { border: 1px solid #444; padding: 5px; vertical-align: top; }
          th { background-color: #0c8ce9; color: white; text-align: center; font-size: 8.5pt; }
          .signature-table { margin-top: 15px; border: none; }
          .signature-table td { border: none; text-align: center; padding: 6px; }
          .no-print { margin-bottom: 10px; padding: 8px 12px; background: #e0f2fe; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
            tr { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <span><strong>Cevap Anahtarı ve Rubrik Yazdırma:</strong> Sayfa yönü 'Yatay (Landscape)' olarak ayarlanmıştır.</span>
          <button onclick="window.print()" style="background: #0c8ce9; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🖨️ Yazdır / PDF Kaydet
          </button>
        </div>

        <div class="header-box">
          <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI - ${settings.schoolName.toUpperCase()}</h2>
          <h3>${exam.academicYear} ${exam.term} ${exam.gradeLevel}. SINIF TARİH DERSİ ${exam.examNumber}</h3>
          <div style="font-size: 8.5pt; font-weight: bold; color: #475569;">CEVAP ANAHTARI VE DERECELİ PUANLAMA ANAHTARI (RUBRİK)</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 5%;">No</th>
              <th style="width: 25%;">Öğrenme Çıktısı / Beceriler</th>
              <th style="width: 40%;">Soru & Model Cevap</th>
              <th style="width: 22%;">Dereceli Puanlama Anahtarı (Rubrik)</th>
              <th style="width: 8%;">Maks. Puan</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <table class="signature-table">
          <tr>
            <td style="width: 50%;">
              <strong>${settings.teacherName}</strong><br>
              Tarih Zümre Başkanı<br><br>
              İmza: .......................................
            </td>
            <td style="width: 50%;">
              <strong>UYGUNDUR</strong><br>
              ${new Date().toLocaleDateString('tr-TR')}<br>
              <strong>${settings.principalName}</strong><br>
              Okul Müdürü<br><br>
              Mühür / İmza: .......................................
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  /**
   * MEB Resmi Sınav Soru ve Kazanım Analiz Tutanağı Yazdırma (A4 Yatay)
   */
  static printExamAnalysis(exam: ExamPaper, analysis: ExamItemAnalysis, settings: AppSettings): void {
    const printWindow = window.open('', '_blank', 'width=1200,height=850');
    if (!printWindow) {
      alert('Yazdırma penceresi açılamadı. Lütfen tarayıcınızın pop-up engelleyicisini kapatın.');
      return;
    }

    const questionOutcomeRowsHtml = exam.questions.map((q, idx) => {
      const rate = analysis.questionSuccessRates[idx] || 0;
      const isAcquired = rate >= 50;
      const avg = (analysis.questionAverageScores[idx] || 0).toFixed(1);
      return `
        <tr>
          <td style="text-align:center; font-weight:bold;">S${q.questionNumber}</td>
          <td>${q.learningOutcome}</td>
          <td style="text-align:center;">${q.difficulty} (${q.maxPoints} P)</td>
          <td style="text-align:center;">${avg} / ${q.maxPoints}</td>
          <td style="text-align:center; font-weight:bold; color: ${isAcquired ? '#166534' : '#991b1b'};">%${rate}</td>
          <td style="text-align:center; font-weight:bold; background:${isAcquired ? '#f0fdf4' : '#fef2f2'}; color:${isAcquired ? '#15803d' : '#b91c1c'};">
            ${isAcquired ? 'Edinildi' : 'Kritik Eksik (Telafi)'}
          </td>
        </tr>
      `;
    }).join('');

    const studentRowsHtml = analysis.students.map((st, sIdx) => {
      const isPass = st.totalScore >= 50;
      return `
        <tr>
          <td style="text-align:center;">${sIdx + 1}</td>
          <td style="text-align:center; font-weight:bold;">${st.studentNo}</td>
          <td><strong>${st.studentName}</strong></td>
          ${exam.questions.map((_, qIdx) => `<td style="text-align:center;">${st.questionScores[qIdx] ?? 0}</td>`).join('')}
          <td style="text-align:center; font-weight:bold; background:${isPass ? '#f0fdf4' : '#fef2f2'}; color:${isPass ? '#15803d' : '#b91c1c'};">${st.totalScore}</td>
          <td style="text-align:center; font-weight:bold; color:${isPass ? '#15803d' : '#b91c1c'};">${isPass ? 'GEÇTİ' : 'KALDI'}</td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>${settings.schoolName} - ${analysis.className} Sınav Analiz Tutanağı</title>
        <style>
          @page { size: A4 landscape; margin: 8mm; }
          * { box-sizing: border-box; font-family: 'Times New Roman', Times, serif; }
          body { margin: 0; padding: 5px; color: #000; font-size: 8.5pt; line-height: 1.25; }
          .header-box { text-align: center; margin-bottom: 6px; border-bottom: 2px solid #003366; padding-bottom: 3px; }
          .header-box h2 { margin: 1px 0; font-size: 11pt; font-weight: bold; color: #003366; }
          .header-box h3 { margin: 1px 0; font-size: 9.5pt; color: #0c8ce9; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
          th, td { border: 1px solid #444; padding: 3px 5px; vertical-align: middle; }
          th { background-color: #0c8ce9; color: white; text-align: center; font-size: 8pt; }
          .stat-card { border: 1px solid #cbd5e1; background: #f8fafc; padding: 6px 10px; border-radius: 4px; font-size: 8pt; }
          .no-print { margin-bottom: 8px; padding: 6px 10px; background: #e0f2fe; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
            tr { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <span><strong>MEB Sınav Soru ve Kazanım Analiz Tutanağı:</strong> A4 Yatay baskı formatı.</span>
          <button onclick="window.print()" style="background: #0c8ce9; color: white; border: none; padding: 5px 12px; border-radius: 4px; font-weight: bold; cursor: pointer;">
            🖨️ Yazdır / PDF Kaydet
          </button>
        </div>

        <div class="header-box">
          <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI - ${settings.schoolName.toUpperCase()}</h2>
          <h3>${exam.academicYear} EĞİTİM ÖĞRETİM YILI ${exam.term.toUpperCase()} ${exam.gradeLevel}. SINIF (${analysis.className}) TARİH DERSİ ${exam.examNumber.toUpperCase()} SINAV SORU VE KAZANIM ANALİZ FORMU</h3>
          <div style="font-size: 8pt; color: #555;">Sınav Kapsamı: ${exam.themeUnit} (${exam.scenario})</div>
        </div>

        <div style="font-weight: bold; color: #003366; margin-bottom: 3px;">1. Soru ve Öğrenme Çıktısı (Kazanım) Başarı Analizi</div>
        <table>
          <thead>
            <tr>
              <th style="width: 5%;">Soru</th>
              <th style="width: 45%;">Öğrenme Çıktısı (Kazanım Kodu & Adı)</th>
              <th style="width: 12%;">Zorluk / Puan</th>
              <th style="width: 12%;">Sınıf Ort.</th>
              <th style="width: 12%;">Başarı %</th>
              <th style="width: 14%;">Durum</th>
            </tr>
          </thead>
          <tbody>
            ${questionOutcomeRowsHtml}
          </tbody>
        </table>

        <div style="font-weight: bold; color: #003366; margin-bottom: 3px;">2. Öğrenci Puan Çizelgesi (Sınıf Listesi)</div>
        <table>
          <thead>
            <tr>
              <th style="width: 4%;">Sıra</th>
              <th style="width: 8%;">No</th>
              <th style="width: 24%;">Öğrenci Adı Soyadı</th>
              ${exam.questions.map(q => `<th style="width: 5%;">S${q.questionNumber}</th>`).join('')}
              <th style="width: 7%;">Toplam</th>
              <th style="width: 7%;">Durum</th>
            </tr>
          </thead>
          <tbody>
            ${studentRowsHtml}
          </tbody>
        </table>

        <table style="border: none; margin-top: 6px;">
          <tr>
            <td style="width: 50%; border: 1px solid #cbd5e1; background: #f8fafc; padding: 6px; vertical-align: top;">
              <strong style="color: #003366;">SINIF BAŞARI İSTATİSTİKLERİ</strong><br>
              • Sınava Katılan: ${analysis.students.length} Öğrenci<br>
              • Sınıf Ortalaması: <strong>${analysis.classAverage.toFixed(1)} Puan</strong><br>
              • En Yüksek / En Düşük Not: ${analysis.highestScore} / ${analysis.lowestScore}<br>
              • Başarılı Sayısı (>=50): ${analysis.passingCount} (%${((analysis.passingCount / (analysis.students.length || 1)) * 100).toFixed(0)})<br>
              • Başarısız Sayısı (<50): ${analysis.failingCount} (%${((analysis.failingCount / (analysis.students.length || 1)) * 100).toFixed(0)})
            </td>
            <td style="width: 50%; border: 1px solid #cbd5e1; background: #f8fafc; padding: 6px; vertical-align: top;">
              <strong style="color: #b91c1c;">KAZANIM TELAFİ VE EYLEM PLANI</strong><br>
              <strong>Kritik Eksik Kazanımlar (<%50):</strong><br>
              ${analysis.unacquiredOutcomes.length > 0 ? analysis.unacquiredOutcomes.map(o => `• <span style="color: #b91c1c;">${o}</span><br>`).join('') : '<em>Tüm kazanımlar %50 barajını aşmıştır.</em><br>'}
              <strong style="color: #003366; margin-top: 3px; display:inline-block;">Öğretmen Telafi Tedbiri:</strong><br>
              <em>${analysis.actionPlan || 'Kritik eksik görülen öğrenme çıktıları sonraki ders saatlerinde kaynak metin tahlili ve soru-cevap ile pekiştirilecektir.'}</em>
            </td>
          </tr>
        </table>

        <table style="border: none; margin-top: 15px;">
          <tr>
            <td style="border: none; text-align: center; width: 50%;">
              <strong>${settings.teacherName}</strong><br>
              Tarih Dersi Öğretmeni<br><br>
              İmza: .......................................
            </td>
            <td style="border: none; text-align: center; width: 50%;">
              <strong>UYGUNDUR</strong><br>
              ${new Date().toLocaleDateString('tr-TR')}<br>
              <strong>${settings.principalName}</strong><br>
              Okul Müdürü<br><br>
              Mühür / İmza: .......................................
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  /**
   * MEB Maarif Tarih Performans Görevi ve Rubrik Yazdırma (A4 Dikey)
   */
  static printPerformanceTask(task: PerformanceTaskItem, settings: AppSettings): void {
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) {
      alert('Yazdırma penceresi açılamadı. Lütfen tarayıcınızın pop-up engelleyicisini kapatın.');
      return;
    }

    const rubricRowsHtml = task.rubricCriteria.map((r, i) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${i + 1}</td>
        <td><strong>${r.title}</strong></td>
        <td>${r.description}</td>
        <td style="text-align: center; font-weight: bold; color: #b91c1c;">${r.points} Puan</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>${settings.schoolName} - ${task.gradeLevel}. Sınıf Performans Görevi</title>
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          * { box-sizing: border-box; font-family: 'Times New Roman', Times, serif; }
          body { margin: 0; padding: 5px; color: #000; font-size: 9.5pt; line-height: 1.3; }
          .header-box { text-align: center; margin-bottom: 8px; border-bottom: 2px solid #003366; padding-bottom: 4px; }
          .header-box h2 { margin: 1px 0; font-size: 12pt; font-weight: bold; color: #003366; }
          .header-box h3 { margin: 1px 0; font-size: 10pt; color: #0c8ce9; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
          th, td { border: 1px solid #444; padding: 4px 6px; }
          th { background-color: #0c8ce9; color: white; text-align: center; }
          .no-print { margin-bottom: 10px; padding: 6px 12px; background: #e0f2fe; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
          @media print { .no-print { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="no-print">
          <span><strong>Öğrenci Performans Görevi ve Rubrik Kağıdı:</strong> A4 Dikey formatı.</span>
          <button onclick="window.print()" style="background: #0c8ce9; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🖨️ Yazdır / PDF Kaydet
          </button>
        </div>

        <div class="header-box">
          <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI - ${settings.schoolName.toUpperCase()}</h2>
          <h3>${task.academicYear} ${task.term.toUpperCase()} ${task.gradeLevel}. SINIF TARİH DERSİ PERFORMANS GÖREVİ VE DERECELİ PUANLAMA ANAHTARI</h3>
        </div>

        <table style="margin-bottom: 10px;">
          <tr>
            <td style="width: 50%;"><strong>ÖĞRENCİ ADI SOYADI:</strong> ...........................................................</td>
            <td style="width: 25%;"><strong>SINIFI / ŞUBESİ:</strong> ${task.gradeLevel} / .........</td>
            <td style="width: 25%;"><strong>NO:</strong> ..............</td>
          </tr>
        </table>

        <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px; border-radius: 6px; margin-bottom: 10px;">
          <div><strong>GÖREV BAŞLIĞI:</strong> ${task.title}</div>
          <div><strong>Ünite / Öğrenme Alanı:</strong> ${task.themeUnit}</div>
          <div><strong>Görevin Amacı:</strong> ${task.objective}</div>
          <div><strong>Hazırlama Süresi & Format:</strong> ${task.deadlineWeeks} Hafta • ${task.submissionFormat}</div>
        </div>

        <div style="font-weight: bold; color: #003366; margin-bottom: 4px;">GÖREV BASAMAKLARI VE YÖNERGE:</div>
        <ol style="margin-top: 0; padding-left: 20px;">
          ${task.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>

        <div style="font-weight: bold; color: #003366; margin-bottom: 4px;">DERECELİ PUANLAMA ANAHTARI (RUBRİK):</div>
        <table>
          <thead>
            <tr>
              <th style="width: 6%;">No</th>
              <th style="width: 28%;">Ölçüt</th>
              <th style="width: 50%;">Açıklama</th>
              <th style="width: 16%;">Puan</th>
            </tr>
          </thead>
          <tbody>
            ${rubricRowsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right; font-weight: bold;">
          ${settings.teacherName} • Tarih Dersi Öğretmeni
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  /**
   * MEB Maarif Modeli 2 Dönemli Yıllık Plan Yazdırma / PDF Çıktısı (A4 Yatay)
   */
  static printFullTwoTermYearlyPlan(plan: FullTwoTermYearlyPlan, settings: AppSettings): void {
    const printWindow = window.open('', '_blank', 'width=1200,height=850');
    if (!printWindow) {
      alert('Yazdırma penceresi açılamadı. Lütfen tarayıcınızın pop-up engelleyicisini kapatın.');
      return;
    }

    const renderTableRows = (weeks: typeof plan.term1Weeks) => {
      return weeks.map((w) => {
        let bgStyle = 'background-color: #ffffff;';
        if (w.specialType === 'EXAM') bgStyle = 'background-color: #fef3c7; font-weight: bold;';
        else if (w.specialType === 'SCHOOL_BASED') bgStyle = 'background-color: #d1fae5; font-weight: bold;';
        else if (w.specialType === 'SOCIAL_ACTIVITY') bgStyle = 'background-color: #f3e8ff; font-weight: bold;';

        return `
          <tr style="${bgStyle}">
            <td style="text-align: center;"><strong>${w.monthName}</strong><br><small>${w.dateRange}</small></td>
            <td style="text-align: center;"><strong>${w.weekNumber}</strong></td>
            <td style="text-align: center;">${w.hours}</td>
            <td><strong>${w.themeUnit}</strong></td>
            <td>${w.learningOutcomes}</td>
            <td style="color: #4b5563; font-size: 8.5pt;">${w.valuesAndSkills}</td>
            <td style="color: ${w.specialNote?.includes('Sınav') ? '#b91c1c' : '#1f2937'}; font-weight: ${w.specialNote ? 'bold' : 'normal'};">
              ${w.specialNote || '-'}
            </td>
          </tr>
        `;
      }).join('');
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>${settings.schoolName} - ${plan.gradeLevel}. Sınıf Tarih 2 Dönemli Yıllık Planı</title>
        <style>
          @page { size: A4 landscape; margin: 8mm; }
          * { box-sizing: border-box; font-family: 'Times New Roman', Times, serif; }
          body { margin: 0; padding: 5px; color: #000; font-size: 9pt; line-height: 1.25; }
          .header-box { text-align: center; margin-bottom: 8px; border-bottom: 2px solid #003366; padding-bottom: 4px; }
          .header-box h2 { margin: 1px 0; font-size: 13pt; font-weight: bold; color: #003366; }
          .header-box h3 { margin: 1px 0; font-size: 11pt; color: #0c8ce9; }
          .meta-info { margin: 4px 0 8px 0; font-size: 9pt; color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          th, td { border: 1px solid #444; padding: 4px 6px; vertical-align: top; }
          th { background-color: #0c8ce9; color: white; text-align: center; font-size: 8.5pt; }
          .section-title { font-size: 10.5pt; font-weight: bold; color: #003366; margin: 8px 0 4px 0; border-left: 4px solid #0c8ce9; padding-left: 6px; }
          .no-print { margin-bottom: 10px; padding: 8px 14px; background: #e0f2fe; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
          @media print { .no-print { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="no-print">
          <span><strong>Maarif Modeli 2 Dönemli Yıllık Plan (A4 Yatay):</strong> Tatiller, sınavlar, okul temelli ve sosyal etkinlik haftaları işlenmiştir.</span>
          <button onclick="window.print()" style="background: #0c8ce9; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🖨️ Yazdır / PDF Kaydet
          </button>
        </div>

        <div class="header-box">
          <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI - ${settings.schoolName.toUpperCase()}</h2>
          <h3>${plan.academicYear} EĞİTİM ÖĞRETİM YILI ${plan.gradeLevel}. SINIF TARİH DERSİ 2 DÖNEMLİ YILLIK PLANI</h3>
          <div class="meta-info">
            Haftalık Ders Saati: <strong>${plan.weeklyHours} Saat</strong> • Yıllık Toplam: <strong>${plan.totalHours} Saat</strong> • Öğretmen: <strong>${settings.teacherName}</strong>
          </div>
        </div>

        <div class="section-title">BİRİNCİ DÖNEM ÇALIŞMA TAKVİMİ VE DERS PLANI (EYLÜL - OCAK)</div>
        <table>
          <thead>
            <tr>
              <th style="width: 10%;">AY / TARİH</th>
              <th style="width: 4%;">HAFTA</th>
              <th style="width: 4%;">SAAT</th>
              <th style="width: 22%;">TEMA / ÖĞRENME ALANI</th>
              <th style="width: 28%;">ÖĞRENME ÇIKTILARI VE SÜREÇ</th>
              <th style="width: 14%;">ERDEM-DEĞER-BECERİ</th>
              <th style="width: 18%;">ÖZEL GÜN / SINAV / ETKİNLİK</th>
            </tr>
          </thead>
          <tbody>
            ${renderTableRows(plan.term1Weeks)}
          </tbody>
        </table>

        <div class="section-title" style="page-break-before: always;">İKİNCİ DÖNEM ÇALIŞMA TAKVİMİ VE DERS PLANI (ŞUBAT - HAZİRAN)</div>
        <table>
          <thead>
            <tr>
              <th style="width: 10%;">AY / TARİH</th>
              <th style="width: 4%;">HAFTA</th>
              <th style="width: 4%;">SAAT</th>
              <th style="width: 22%;">TEMA / ÖĞRENME ALANI</th>
              <th style="width: 28%;">ÖĞRENME ÇIKTILARI VE SÜREÇ</th>
              <th style="width: 14%;">ERDEM-DEĞER-BECERİ</th>
              <th style="width: 18%;">ÖZEL GÜN / SINAV / ETKİNLİK</th>
            </tr>
          </thead>
          <tbody>
            ${renderTableRows(plan.term2Weeks)}
          </tbody>
        </table>

        <table style="border: none; margin-top: 20px;">
          <tr style="border: none;">
            <td style="border: none; width: 50%; text-align: center;">
              <strong>${settings.teacherName}</strong><br>
              Tarih Dersi Öğretmeni<br>
              İmza: .............................
            </td>
            <td style="border: none; width: 50%; text-align: center;">
              <strong>UYGUNDUR</strong><br>
              ${settings.principalName}<br>
              Okul Müdürü<br>
              İmza / Mühür: .............................
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}

