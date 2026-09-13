import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  HeadingLevel,
  PageOrientation
} from 'docx';
import { saveAs } from 'file-saver';
import { PlanItem, AppSettings, EvaluationScale, ExamPaper, ExamItemAnalysis, PerformanceTaskItem, DepartmentMinutesItem } from '../../core/types';

export class DocxExportService {
  /**
   * Generates and downloads an official MEB Türkiye Yüzyılı Maarif Modeli compliant Word document.
   * For DAILY plans: combines all 3 sections shown in official MEB guidance (Ders Bilgisi/Programlar Arası, Öğrenme Çıktıları/Kanıtları, Öğrenme-Öğretme Yaşantıları).
   * For YEARLY plans: formatted according to MEB Work Calendar with user-specified weekly hours.
   */
  static async exportPlanToWord(plan: PlanItem, settings: AppSettings): Promise<void> {
    const isDaily = plan.type === 'DAILY';

    if (isDaily) {
      await this.exportMaarifDailyPlan(plan, settings);
    } else {
      await this.exportMaarifYearlyPlan(plan, settings);
    }
  }

  /**
   * Birebir Resmi 3 Bölümlü Maarif Modeli Günlük Ders Planı
   */
  private static async exportMaarifDailyPlan(plan: PlanItem, settings: AppSettings): Promise<void> {
    const cellBorder = {
      top: { style: BorderStyle.SINGLE, size: 1, color: '5B9BD5' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '5B9BD5' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '5B9BD5' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '5B9BD5' }
    };

    const sectionHeaderBg = 'C6D9A7'; // Açık yeşil / zeytin resmi maarif başlık rengi (Resimlerdeki renk)
    const labelColWidth = 26;
    const valColWidth = 74;

    // BÖLÜM 1: DERS BİLGİSİ TABLOSU
    const tableRows: TableRow[] = [
      // 1. DERS BİLGİSİ Başlığı
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 4,
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: sectionHeaderBg },
            borders: cellBorder,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'DERS BİLGİSİ', bold: true, size: 21, color: '000000' })
                ]
              })
            ]
          })
        ]
      }),
      // Sınıf & Ders
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Sınıf', bold: true, size: 19 })] })]
          }),
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: `${plan.gradeLevel}. SINIF`, size: 19 })] })]
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Ders', bold: true, size: 19 })] })]
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: plan.subject || 'TARİH', size: 19 })] })]
          })
        ]
      }),
      // Tema & Süre
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Tema', bold: true, size: 19 })] })]
          }),
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: plan.themeUnit, bold: true, size: 19 })] })]
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Süre', bold: true, size: 19 })] })]
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: `${plan.lessonHours || 2} Ders Saati`, bold: true, size: 19 })] })]
          })
        ]
      }),
      // Alan Becerileri
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Alan Becerileri', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: plan.domainSkills || (plan.skills || []).join(', '), size: 18 })] })]
          })
        ]
      }),
      // Kavramsal Beceriler
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Kavramsal Beceriler', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: plan.conceptualSkills || 'KB2.4. Çözümleme', size: 18 })] })]
          })
        ]
      }),
      // Eğilimler
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Eğilimler', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: plan.dispositions || 'E2.1. Empati, E3.2. Odaklanma, E3.6. Analitiklik Düşünme', size: 18 })] })]
          })
        ]
      }),

      // 2. PROGRAMLAR ARASI BİLEŞENLER Başlığı
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 4,
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: sectionHeaderBg },
            borders: cellBorder,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'PROGRAMLAR ARASI BİLEŞENLER', bold: true, size: 21, color: '000000' })
                ]
              })
            ]
          })
        ]
      }),
      // Sosyal-Duygusal Öğr. Bec.
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Sosyal-Duygusal Öğr. Bec.', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: plan.socialEmotionalSkills || 'SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme', size: 18 })] })]
          })
        ]
      }),
      // Değerler
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Değerler', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: plan.values.join(', '), size: 18 })] })]
          })
        ]
      }),
      // Okuryazarlık Becerileri
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Okuryazarlık Becerileri', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: plan.literacySkills || 'OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık', size: 18 })] })]
          })
        ]
      }),
      // Disiplinler Arası İlişki
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Disiplinler Arası İlişki', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: plan.interdisciplinaryRelations || 'Coğrafya, Felsefe, Matematik, Sosyoloji', size: 18 })] })]
          })
        ]
      }),
      // Beceriler Arası İlişki
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Beceriler Arası İlişki', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: plan.interSkillRelations || 'SBAB2. Kanıta Dayalı Sorgulama ve Araştırma, SBAB2.2. Kaynaklardan Bilgi Toplama, KB3.1. Karar Verme', size: 18 })] })]
          })
        ]
      }),

      // BÖLÜM 2: ÖĞRENME ÇIKTILARI, İÇERİK VE ÖĞRENME KANITLARI
      // Öğrenme Çıktıları ve Süreç Bileşenleri
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Öğrenme Çıktıları ve Süreç Bileşenleri', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: plan.learningOutcomes.map(o => new Paragraph({ children: [new TextRun({ text: o, size: 18 })] }))
          })
        ]
      }),
      // İçerik Çerçevesi
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'İçerik Çerçevesi', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: plan.contentFramework || plan.topics.join(', '), bold: true, size: 19 })] })]
          })
        ]
      }),
      // Öğrenme Kanıtları
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Öğrenme Kanıtları', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: (plan.learningEvidences || plan.evaluation).split('\n').map(line =>
              new Paragraph({ children: [new TextRun({ text: line, size: 18 })] })
            )
          })
        ]
      }),

      // BÖLÜM 3: ÖĞRENME-ÖĞRETME YAŞANTILARI
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 4,
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: sectionHeaderBg },
            borders: cellBorder,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'ÖĞRENME-ÖĞRETME YAŞANTILARI', bold: true, size: 21, color: '000000' })
                ]
              })
            ]
          })
        ]
      }),
      // Temel Kabuller
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Temel Kabuller', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: (plan.basicAssumptions || '* Öğrencilerin kültürel mirasın aktarılmasında tarihin rolü olduğu bilgisine sahip oldukları kabul edilmektedir.').split('\n').map(line =>
              new Paragraph({ children: [new TextRun({ text: line, size: 18 })] })
            )
          })
        ]
      }),
      // Ön Değerlendirme Süreci
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Ön Değerlendirme Süreci', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: (plan.preAssessmentProcess || '* Ünite kapsamında öğrencilere rehber sorular yönlendirilir.').split('\n').map(line =>
              new Paragraph({ children: [new TextRun({ text: line, size: 18 })] })
            )
          })
        ]
      }),
      // Öğrenme-Öğretme Uygulamaları
      new TableRow({
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: 'F2F2F2' },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: 'Öğrenme-Öğretme Uygulamaları', bold: true, size: 19 })] })]
          }),
          new TableCell({
            columnSpan: 3,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [
              new Paragraph({ children: [new TextRun({ text: plan.processComponents, size: 18 })] }),
              new Paragraph({ text: '' }),
              new Paragraph({ children: [new TextRun({ text: 'Farklılaştırma (Zenginleştirme): ', bold: true, size: 18 }), new TextRun({ text: plan.differentiation.enrichment || 'Arşiv ve müze taraması.', size: 18 })] }),
              new Paragraph({ children: [new TextRun({ text: 'Farklılaştırma (Destekleme): ', bold: true, size: 18 }), new TextRun({ text: plan.differentiation.support || 'Görsel kart eşleştirme alıştırması.', size: 18 })] })
            ]
          })
        ]
      })
    ];

    const maarifTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows
    });

    // Signatures
    const signatureTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                right: { style: BorderStyle.NONE, size: 0, color: 'auto' }
              },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${settings.teacherName}`, bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tarih Öğretmeni', size: 19 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'İmza', size: 18 })] })
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                right: { style: BorderStyle.NONE, size: 0, color: 'auto' }
              },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'UYGUNDUR', bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${new Date().toLocaleDateString('tr-TR')}`, size: 18 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${settings.principalName}`, bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Okul Müdürü', size: 19 })] })
              ]
            })
          ]
        })
      ]
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: { orientation: PageOrientation.PORTRAIT },
              margin: { top: 720, bottom: 720, left: 720, right: 720 }
            }
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              heading: HeadingLevel.HEADING_1,
              children: [new TextRun({ text: `${settings.schoolName.toUpperCase()} MÜDÜRLÜĞÜ`, bold: true, size: 22 })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `${plan.gradeLevel}. SINIF TARİH DERSİ GÜNLÜK PLANI`, bold: true, size: 22 })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `${plan.weekNumber}. HAFTA (${plan.dateRange})`, bold: true, size: 20, color: '1F4E79' })]
            }),
            new Paragraph({ text: '' }),
            maarifTable,
            new Paragraph({ text: '' }),
            signatureTable
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${settings.schoolName}_Tarih_${plan.gradeLevel}Sinif_${plan.weekNumber}Hafta_Gunluk_Plan.docx`;
    saveAs(blob, fileName);
  }

  /**
   * MEB Çalışma Takvimine Uygun Yıllık Plan Word Çıktısı
   */
  private static async exportMaarifYearlyPlan(plan: PlanItem, settings: AppSettings): Promise<void> {
    const cellBorder = {
      top: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '888888' }
    };

    const headerBorder = {
      top: { style: BorderStyle.SINGLE, size: 2, color: '003366' },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: '003366' },
      left: { style: BorderStyle.SINGLE, size: 2, color: '003366' },
      right: { style: BorderStyle.SINGLE, size: 2, color: '003366' }
    };

    // Header info table
    const infoTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              shading: { fill: 'EBF3FA' },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Okul Adı:', bold: true, size: 20 })] })]
            }),
            new TableCell({
              width: { size: 80, type: WidthType.PERCENTAGE },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: settings.schoolName, size: 20 })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              shading: { fill: 'EBF3FA' },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Ders / Sınıf / Saat:', bold: true, size: 20 })] })]
            }),
            new TableCell({
              width: { size: 80, type: WidthType.PERCENTAGE },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: `Tarih / ${plan.gradeLevel}. Sınıf  •  Haftalık ${plan.lessonHours || settings.defaultWeeklyHours || 2} Ders Saati (Toplam: ${plan.totalYearlyHours || 72} Saat)`, bold: true, size: 20 })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              shading: { fill: 'EBF3FA' },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Öğretim Yılı / Öğretmen:', bold: true, size: 20 })] })]
            }),
            new TableCell({
              width: { size: 80, type: WidthType.PERCENTAGE },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: `${settings.academicYear} (${settings.term})  •  Tarih Öğretmeni: ${settings.teacherName}`, size: 20 })] })]
            })
          ]
        })
      ]
    });

    // Exact 12 Columns matching official MEB Maarif Yıllık Plan image:
    // TARİH | HAFTA | SAAT | TEMA | İÇERİK ÇERÇEVESİ | ÖĞRENME ÇIKTILARI | SÜREÇ BİLEŞENLERİ | ÖĞRENME BECERİLERİ | DEĞERLER | OKURYAZARLIK BECERİLERİ | ÖLÇME DEĞERLENDİRME | BELİRLİ GÜN ve HAFT.
    const planTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 7, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TARİH', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 6, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'HAFTA', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 5, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'SAAT', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TEMA', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'İÇERİK ÇERÇEVESİ', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 12, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ÖĞRENME ÇIKTILARI', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 13, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'SÜREÇ BİLEŞENLERİ', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 9, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ÖĞRENME BECERİLERİ', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 7, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'DEĞERLER', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 8, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'OKURYAZARLIK BECERİLERİ', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 8, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ÖLÇME DEĞERLENDİRME', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 5, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'BELİRLİ GÜN ve HAFT.', bold: true, color: 'FFFFFF', size: 16 })] })]
            })
          ]
        }),
        // Data Row
        new TableRow({
          children: [
            // TARİH
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: plan.dateRange, size: 16 })] })]
            }),
            // HAFTA
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${plan.weekNumber}. Hafta`, bold: true, size: 16 })] })]
            }),
            // SAAT
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${plan.lessonHours || settings.defaultWeeklyHours || 2} Saat`, bold: true, size: 16 })] })]
            }),
            // TEMA
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: plan.themeUnit, bold: true, size: 16 })] })]
            }),
            // İÇERİK ÇERÇEVESİ
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: plan.contentFramework || plan.topics.join(', '), size: 16 })] })]
            }),
            // ÖĞRENME ÇIKTILARI
            new TableCell({
              borders: cellBorder,
              children: plan.learningOutcomes.map(o => new Paragraph({ children: [new TextRun({ text: o, size: 16 })] }))
            }),
            // SÜREÇ BİLEŞENLERİ
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: plan.processComponents, size: 16 })] })]
            }),
            // ÖĞRENME BECERİLERİ
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: plan.socialEmotionalSkills || 'SDB1.2. Kendini Düzenleme, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme', size: 15 })] })]
            }),
            // DEĞERLER
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: plan.values.join(', '), size: 15 })] })]
            }),
            // OKURYAZARLIK BECERİLERİ
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: plan.literacySkills || 'OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık', size: 15 })] })]
            }),
            // ÖLÇME DEĞERLENDİRME
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: plan.learningEvidences || plan.evaluation, size: 15 })] })]
            }),
            // BELİRLİ GÜN VE HAFTALIK NOT
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: plan.notes || '', bold: true, size: 15, color: '800000' })] })]
            })
          ]
        })
      ]
    });

    const signatureTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                right: { style: BorderStyle.NONE, size: 0, color: 'auto' }
              },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${settings.teacherName}`, bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tarih Öğretmeni', size: 19 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'İmza', size: 18 })] })
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                right: { style: BorderStyle.NONE, size: 0, color: 'auto' }
              },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'UYGUNDUR', bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${new Date().toLocaleDateString('tr-TR')}`, size: 18 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${settings.principalName}`, bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Okul Müdürü', size: 19 })] })
              ]
            })
          ]
        })
      ]
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: { orientation: PageOrientation.LANDSCAPE },
              margin: { top: 720, bottom: 720, left: 720, right: 720 }
            }
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              heading: HeadingLevel.HEADING_1,
              children: [new TextRun({ text: 'T.C. MİLLÎ EĞİTİM BAKANLIĞI', bold: true, size: 24, color: '003366' })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `${settings.schoolName.toUpperCase()} MÜDÜRLÜĞÜ`, bold: true, size: 22, color: '003366' })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `TÜRKİYE YÜZYILI MAARİF MODELİ ${plan.gradeLevel}. SINIF TARİH DERSİ YILLIK PLANI`, bold: true, size: 22, color: '0C8CE9' })]
            }),
            new Paragraph({ text: '' }),
            infoTable,
            new Paragraph({ text: '' }),
            planTable,
            new Paragraph({ text: '' }),
            new Paragraph({ text: '' }),
            signatureTable
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${settings.schoolName}_Tarih_${plan.gradeLevel}Sinif_${plan.weekNumber}Hafta_Yillik_Plan.docx`;
    saveAs(blob, fileName);
  }

  /**
   * MEB Çalışma Takvimine Uygun TÜM YILLIK PLANI (Çoklu Haftaları) 12 Sütunlu Tek Bir Word Belgesi Olarak İndirir
   */
  static async exportMultipleYearlyPlansToWord(plans: PlanItem[], settings: AppSettings, grade?: number): Promise<void> {
    const cellBorder = {
      top: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '888888' }
    };

    const headerBorder = {
      top: { style: BorderStyle.SINGLE, size: 2, color: '003366' },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: '003366' },
      left: { style: BorderStyle.SINGLE, size: 2, color: '003366' },
      right: { style: BorderStyle.SINGLE, size: 2, color: '003366' }
    };

    // Sort plans by weekNumber
    const sortedPlans = [...plans].sort((a, b) => a.weekNumber - b.weekNumber);
    const targetGrade = grade || sortedPlans[0]?.gradeLevel || 9;
    const weeklyHours = sortedPlans[0]?.lessonHours || settings.defaultWeeklyHours || 2;
    const totalHours = sortedPlans.reduce((acc, p) => acc + (p.lessonHours || weeklyHours), 0);

    const infoTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              shading: { fill: 'EBF3FA' },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Okul Adı:', bold: true, size: 20 })] })]
            }),
            new TableCell({
              width: { size: 80, type: WidthType.PERCENTAGE },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: settings.schoolName, size: 20 })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              shading: { fill: 'EBF3FA' },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Ders / Sınıf / Saat:', bold: true, size: 20 })] })]
            }),
            new TableCell({
              width: { size: 80, type: WidthType.PERCENTAGE },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: `Tarih / ${targetGrade}. Sınıf  •  Haftalık ${weeklyHours} Ders Saati (Planlanan Toplam: ${totalHours} Saat)`, bold: true, size: 20 })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              shading: { fill: 'EBF3FA' },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Öğretim Yılı / Öğretmen:', bold: true, size: 20 })] })]
            }),
            new TableCell({
              width: { size: 80, type: WidthType.PERCENTAGE },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: `${settings.academicYear} (${settings.term})  •  Tarih Öğretmeni: ${settings.teacherName}`, size: 20 })] })]
            })
          ]
        })
      ]
    });

    const dataRows = sortedPlans.map((p) => {
      return new TableRow({
        children: [
          // TARİH
          new TableCell({
            borders: cellBorder,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: p.dateRange, size: 16 })] })]
          }),
          // HAFTA
          new TableCell({
            borders: cellBorder,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${p.weekNumber}. Hafta`, bold: true, size: 16 })] })]
          }),
          // SAAT
          new TableCell({
            borders: cellBorder,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${p.lessonHours || weeklyHours} Saat`, bold: true, size: 16 })] })]
          }),
          // TEMA
          new TableCell({
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: p.themeUnit, bold: true, size: 16, color: '003366' })] })]
          }),
          // İÇERİK ÇERÇEVESİ
          new TableCell({
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: p.contentFramework || p.topics.join(', '), bold: true, size: 16 })] })]
          }),
          // ÖĞRENME ÇIKTILARI
          new TableCell({
            borders: cellBorder,
            children: p.learningOutcomes.map(o => new Paragraph({ children: [new TextRun({ text: `• ${o}`, size: 15 })] }))
          }),
          // SÜREÇ BİLEŞENLERİ
          new TableCell({
            borders: cellBorder,
            children: (p.processComponents || '').split('\n').map(line => new Paragraph({ children: [new TextRun({ text: line, size: 15 })] }))
          }),
          // ÖĞRENME BECERİLERİ
          new TableCell({
            borders: cellBorder,
            children: [
              new Paragraph({ children: [new TextRun({ text: `Alan: ${p.domainSkills || 'SBAB1'}`, size: 14 })] }),
              new Paragraph({ children: [new TextRun({ text: `Kavramsal: ${p.conceptualSkills || 'KB2.4'}`, size: 14 })] }),
              new Paragraph({ children: [new TextRun({ text: `Eğilimler: ${p.dispositions || 'E3.2'}`, size: 14 })] })
            ]
          }),
          // DEĞERLER
          new TableCell({
            borders: cellBorder,
            children: p.values.map(v => new Paragraph({ children: [new TextRun({ text: `• ${v}`, bold: true, size: 15, color: '7030A0' })] }))
          }),
          // OKURYAZARLIK BECERİLERİ
          new TableCell({
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: p.literacySkills || 'OB1, OB2', size: 14 })] })]
          }),
          // ÖLÇME DEĞERLENDİRME
          new TableCell({
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: p.learningEvidences || p.evaluation, size: 14 })] })]
          }),
          // BELİRLİ GÜN VE HAFTALIK NOT
          new TableCell({
            borders: cellBorder,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: p.notes || '', bold: true, size: 14, color: '800000' })] })]
          })
        ]
      });
    });

    const planTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 7, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TARİH', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 6, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'HAFTA', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 5, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'SAAT', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TEMA', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'İÇERİK ÇERÇEVESİ', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 12, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ÖĞRENME ÇIKTILARI', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 13, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'SÜREÇ BİLEŞENLERİ', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 9, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ÖĞRENME BECERİLERİ', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 7, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'DEĞERLER', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 8, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'OKURYAZARLIK BECERİLERİ', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 8, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ÖLÇME DEĞERLENDİRME', bold: true, color: 'FFFFFF', size: 16 })] })]
            }),
            new TableCell({
              width: { size: 5, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'BELİRLİ GÜN ve HAFT.', bold: true, color: 'FFFFFF', size: 16 })] })]
            })
          ]
        }),
        ...dataRows
      ]
    });

    const signatureTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                right: { style: BorderStyle.NONE, size: 0, color: 'auto' }
              },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${settings.teacherName}`, bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tarih Öğretmeni', size: 19 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'İmza', size: 18 })] })
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                right: { style: BorderStyle.NONE, size: 0, color: 'auto' }
              },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'UYGUNDUR', bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${new Date().toLocaleDateString('tr-TR')}`, size: 18 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${settings.principalName}`, bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Okul Müdürü', size: 19 })] })
              ]
            })
          ]
        })
      ]
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: { orientation: PageOrientation.LANDSCAPE },
              margin: { top: 720, bottom: 720, left: 720, right: 720 }
            }
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              heading: HeadingLevel.HEADING_1,
              children: [new TextRun({ text: 'T.C. MİLLÎ EĞİTİM BAKANLIĞI', bold: true, size: 24, color: '003366' })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `${settings.schoolName.toUpperCase()} MÜDÜRLÜĞÜ`, bold: true, size: 22, color: '003366' })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `TÜRKİYE YÜZYILI MAARİF MODELİ ${targetGrade}. SINIF TARİH DERSİ YILLIK ÇALIŞMA PLANI`, bold: true, size: 22, color: '0C8CE9' })]
            }),
            new Paragraph({ text: '' }),
            infoTable,
            new Paragraph({ text: '' }),
            planTable,
            new Paragraph({ text: '' }),
            new Paragraph({ text: '' }),
            signatureTable
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${settings.schoolName}_Tarih_${targetGrade}Sinif_Tum_Yillik_Plan.docx`;
    saveAs(blob, fileName);
  }

  /**
   * Export Evaluation Scale to Word
   */
  static async exportScaleToWord(scale: EvaluationScale, settings: AppSettings): Promise<void> {
    const cellBorder = {
      top: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '888888' }
    };

    const criteriaRows = scale.criteria.map((c, idx) => {
      return new TableRow({
        children: [
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${idx + 1}`, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: c.dimension, bold: true, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ children: [new TextRun({ text: c.description, size: 19 })] })]
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${c.maxScore} Puan`, bold: true, size: 20 })] })]
          })
        ]
      });
    });

    const scaleTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: cellBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF', size: 20 })] })]
            }),
            new TableCell({
              width: { size: 35, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: cellBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Değerlendirme Boyutu / Ölçüt', bold: true, color: 'FFFFFF', size: 20 })] })]
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: cellBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Açıklama / Gösterge', bold: true, color: 'FFFFFF', size: 20 })] })]
            }),
            new TableCell({
              width: { size: 15, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: cellBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Maks. Puan', bold: true, color: 'FFFFFF', size: 20 })] })]
            })
          ]
        }),
        ...criteriaRows
      ]
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              heading: HeadingLevel.HEADING_1,
              children: [new TextRun({ text: 'T.C. MİLLÎ EĞİTİM BAKANLIĞI', bold: true, size: 24 })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `${settings.schoolName} - TARİH DERSİ`, bold: true, size: 22 })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: scale.title.toUpperCase(), bold: true, size: 22, color: '0C8CE9' })]
            }),
            new Paragraph({ text: '' }),
            new Paragraph({ children: [new TextRun({ text: `Amaç: `, bold: true }), new TextRun({ text: scale.purpose })] }),
            new Paragraph({ children: [new TextRun({ text: `Yönerge: `, bold: true }), new TextRun({ text: scale.instructions })] }),
            new Paragraph({ text: '' }),
            scaleTable,
            new Paragraph({ text: '' }),
            new Paragraph({ text: '' }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: `Ders Öğretmeni: ${settings.teacherName}            İmza: .........................`, size: 20 })
              ]
            })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${scale.title.replace(/\s+/g, '_')}_Olcegi.docx`);
  }

  /**
   * MEB Resmi Formatında Açık Uçlu Öğrenci Sınav Soru Kağıdı (.docx)
   */
  static async exportExamPaperToWord(exam: ExamPaper, settings: AppSettings): Promise<void> {
    const thinBorder = {
      top: { style: BorderStyle.SINGLE, size: 1, color: '666666' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '666666' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '666666' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '666666' }
    };

    // Student Header Table
    const studentInfoTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              borders: thinBorder,
              children: [
                new Paragraph({ children: [new TextRun({ text: 'ADI VE SOYADI: ', bold: true, size: 19 })] }),
                new Paragraph({ children: [new TextRun({ text: '..........................................................', size: 18 })] })
              ]
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              borders: thinBorder,
              children: [
                new Paragraph({ children: [new TextRun({ text: 'SINIFI / ŞUBESİ: ', bold: true, size: 19 })] }),
                new Paragraph({ children: [new TextRun({ text: `${exam.gradeLevel} / ...........`, size: 19 })] })
              ]
            }),
            new TableCell({
              width: { size: 15, type: WidthType.PERCENTAGE },
              borders: thinBorder,
              children: [
                new Paragraph({ children: [new TextRun({ text: 'NO: ', bold: true, size: 19 })] }),
                new Paragraph({ children: [new TextRun({ text: '................', size: 19 })] })
              ]
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              shading: { fill: 'F2F2F2' },
              borders: thinBorder,
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ALDIĞI PUAN', bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '.............. / 100', bold: true, size: 20, color: 'C00000' })] })
              ]
            })
          ]
        })
      ]
    });

    const questionElements: (Paragraph | Table)[] = [];

    exam.questions.forEach((q) => {
      // Question Header bar
      const qHeaderTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 80, type: WidthType.PERCENTAGE },
                shading: { fill: '0C8CE9' },
                borders: thinBorder,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `SORU ${q.questionNumber} `, bold: true, color: 'FFFFFF', size: 20 }),
                      new TextRun({ text: `[${q.difficulty || 'Orta'}${q.cognitiveLevel ? ' • ' + q.cognitiveLevel : ''}]: `, bold: true, color: 'FFE082', size: 18 }),
                      new TextRun({ text: `(${q.learningOutcome})`, size: 16, color: 'EBF3FA', italics: true })
                    ]
                  })
                ]
              }),
              new TableCell({
                width: { size: 20, type: WidthType.PERCENTAGE },
                shading: { fill: '003366' },
                borders: thinBorder,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({ text: `[ ${q.maxPoints} PUAN ]`, bold: true, color: 'FFFFFF', size: 20 })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      });

      questionElements.push(new Paragraph({ text: '' }));
      questionElements.push(qHeaderTable);

      // Context Box (Bağlam / Senaryo / Metin)
      if (q.contextText) {
        const contextTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  shading: { fill: 'F9FAFB' },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                    left: { style: BorderStyle.SINGLE, size: 3, color: '0C8CE9' },
                    right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }
                  },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: 'BAĞLAM / TARİHSEL METİN: ', bold: true, size: 17, color: '003366' }),
                        new TextRun({ text: q.contextText, italics: true, size: 18 })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        });
        questionElements.push(contextTable);
      }

      // Question text
      questionElements.push(
        new Paragraph({
          children: [
            new TextRun({ text: q.questionText, bold: true, size: 19 })
          ]
        })
      );

      // Dotted writing lines for open-ended response
      questionElements.push(
        new Paragraph({
          children: [new TextRun({ text: 'Cevap: ...................................................................................................................................................................................', size: 17, color: '888888' })]
        }),
        new Paragraph({
          children: [new TextRun({ text: '...................................................................................................................................................................................................', size: 17, color: '888888' })]
        }),
        new Paragraph({
          children: [new TextRun({ text: '...................................................................................................................................................................................................', size: 17, color: '888888' })]
        }),
        new Paragraph({
          children: [new TextRun({ text: '...................................................................................................................................................................................................', size: 17, color: '888888' })]
        })
      );
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: { orientation: PageOrientation.PORTRAIT },
              margin: { top: 720, bottom: 720, left: 720, right: 720 }
            }
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              heading: HeadingLevel.HEADING_1,
              children: [new TextRun({ text: 'T.C. MİLLÎ EĞİTİM BAKANLIĞI', bold: true, size: 22, color: '003366' })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `${settings.schoolName.toUpperCase()}`, bold: true, size: 20 })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${exam.academicYear} EĞİTİM ÖĞRETİM YILI ${exam.term.toUpperCase()} ${exam.gradeLevel}. SINIF TARİH DERSİ ${exam.examNumber.toUpperCase()}`,
                  bold: true,
                  size: 21,
                  color: '0C8CE9'
                })
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: `( ${exam.scenario} - Süre: ${exam.durationMinutes} Dakika )`, bold: true, size: 18, color: '555555' })
              ]
            }),
            new Paragraph({ text: '' }),
            studentInfoTable,
            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({ text: 'YÖNERGE: ', bold: true, size: 18, color: '003366' }),
                new TextRun({ text: exam.instructions, size: 17 })
              ]
            }),
            ...questionElements,
            new Paragraph({ text: '' }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: '--- Sınavınız Bitmiştir. Yanıtlarınızı Kontrol Ediniz. Başarılar Dileriz! ---', bold: true, size: 18, color: '555555' })
              ]
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: `${settings.teacherName}  •  Tarih Öğretmeni`, bold: true, size: 19 })
              ]
            })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${settings.schoolName}_Tarih_${exam.gradeLevel}Sinif_${exam.term.replace(/\s+/g, '')}_${exam.examNumber.replace(/\s+/g, '')}_Soru_Kagidi.docx`;
    saveAs(blob, fileName);
  }

  /**
   * MEB Resmi Formatında Dereceli Cevap Anahtarı ve Puanlama Rubriği (.docx)
   */
  static async exportExamAnswerKeyToWord(exam: ExamPaper, settings: AppSettings): Promise<void> {
    const thinBorder = {
      top: { style: BorderStyle.SINGLE, size: 1, color: '666666' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '666666' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '666666' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '666666' }
    };

    const headerBorder = {
      top: { style: BorderStyle.SINGLE, size: 2, color: '003366' },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: '003366' },
      left: { style: BorderStyle.SINGLE, size: 2, color: '003366' },
      right: { style: BorderStyle.SINGLE, size: 2, color: '003366' }
    };

    const answerRows = exam.questions.map((q) => {
      const rubricLines = q.rubricGuide.map(r =>
        new Paragraph({
          children: [
            new TextRun({ text: `• ${r.criterion}: `, size: 15, bold: true }),
            new TextRun({ text: `[${r.points} Puan]`, size: 15, color: 'C00000', bold: true }),
            ...(r.partialGuidance ? [new TextRun({ text: ` (${r.partialGuidance})`, size: 14, italics: true, color: '555555' })] : [])
          ]
        })
      );

      const partialCreditParagraphs = q.partialCreditNotes ? [
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [
            new TextRun({ text: '⚠️ Kademeli / Yarım Cevap Kuralı: ', bold: true, size: 15, color: 'B25900' }),
            new TextRun({ text: q.partialCreditNotes, size: 15, italics: true, color: '7A3E00' })
          ]
        })
      ] : [];

      return new TableRow({
        children: [
          // Soru No
          new TableCell({
            width: { size: 7, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${q.questionNumber}`, bold: true, size: 20 })] })]
          }),
          // Kazanım & Beceriler & Değer
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Zorluk: ', bold: true, size: 15, color: q.difficulty === 'Zor' ? 'C00000' : q.difficulty === 'Orta' ? '0066CC' : '008000' }), new TextRun({ text: `${q.difficulty || 'Orta'}${q.cognitiveLevel ? ' (' + q.cognitiveLevel + ')' : ''}`, bold: true, size: 15, color: q.difficulty === 'Zor' ? 'C00000' : q.difficulty === 'Orta' ? '0066CC' : '008000' })] }),
              new Paragraph({ children: [new TextRun({ text: 'Kazanım: ', bold: true, size: 16 }), new TextRun({ text: q.learningOutcome, size: 16 })] }),
              new Paragraph({ children: [new TextRun({ text: 'Alan: ', bold: true, size: 15 }), new TextRun({ text: q.domainSkill || 'SBAB', size: 15 })] }),
              new Paragraph({ children: [new TextRun({ text: 'Kavramsal: ', bold: true, size: 15 }), new TextRun({ text: q.conceptualSkill || 'KB', size: 15 })] }),
              new Paragraph({ children: [new TextRun({ text: 'Değer: ', bold: true, size: 15, color: '7030A0' }), new TextRun({ text: q.value || 'Maarif Değeri', size: 15, color: '7030A0' })] })
            ]
          }),
          // Beklenen / Model Cevap
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Soru: ', bold: true, size: 16, color: '003366' }), new TextRun({ text: q.questionText, size: 16, italics: true })] }),
              new Paragraph({ text: '' }),
              new Paragraph({ children: [new TextRun({ text: 'Model Cevap:', bold: true, size: 17, color: '006600' })] }),
              ...q.sampleAnswer.split('\n').map(line => new Paragraph({ children: [new TextRun({ text: line, size: 17 })] }))
            ]
          }),
          // Dereceli Puanlama Anahtarı (Rubrik)
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Puanlama Ölçütleri:', bold: true, size: 16, color: '003366' })] }),
              ...rubricLines,
              ...partialCreditParagraphs
            ]
          }),
          // Toplam Puan
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${q.maxPoints} Puan`, bold: true, size: 20, color: 'C00000' })] })
            ]
          })
        ]
      });
    });

    const answerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 7, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF', size: 18 })] })]
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Öğrenme Çıktısı / Beceriler', bold: true, color: 'FFFFFF', size: 18 })] })]
            }),
            new TableCell({
              width: { size: 38, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Soru & Beklenen Model Cevap', bold: true, color: 'FFFFFF', size: 18 })] })]
            }),
            new TableCell({
              width: { size: 22, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Dereceli Puanlama Anahtarı (Rubrik)', bold: true, color: 'FFFFFF', size: 18 })] })]
            }),
            new TableCell({
              width: { size: 8, type: WidthType.PERCENTAGE },
              shading: { fill: '0C8CE9' },
              borders: headerBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Maks. Puan', bold: true, color: 'FFFFFF', size: 18 })] })]
            })
          ]
        }),
        ...answerRows
      ]
    });

    const signatureTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                right: { style: BorderStyle.NONE, size: 0, color: 'auto' }
              },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${settings.teacherName}`, bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tarih Zümre Başkanı', size: 19 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'İmza', size: 18 })] })
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                right: { style: BorderStyle.NONE, size: 0, color: 'auto' }
              },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'UYGUNDUR', bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${new Date().toLocaleDateString('tr-TR')}`, size: 18 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${settings.principalName}`, bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Okul Müdürü', size: 19 })] })
              ]
            })
          ]
        })
      ]
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: { orientation: PageOrientation.LANDSCAPE },
              margin: { top: 720, bottom: 720, left: 720, right: 720 }
            }
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              heading: HeadingLevel.HEADING_1,
              children: [new TextRun({ text: 'T.C. MİLLÎ EĞİTİM BAKANLIĞI', bold: true, size: 24, color: '003366' })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `${settings.schoolName.toUpperCase()}`, bold: true, size: 22 })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${exam.academicYear} ${exam.term} ${exam.gradeLevel}. SINIF TARİH DERSİ ${exam.examNumber} CEVAP ANAHTARI VE DERECELİ PUANLAMA ANAHTARI (RUBRİK)`,
                  bold: true,
                  size: 21,
                  color: '0C8CE9'
                })
              ]
            }),
            new Paragraph({ text: '' }),
            answerTable,
            new Paragraph({ text: '' }),
            signatureTable
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${settings.schoolName}_Tarih_${exam.gradeLevel}Sinif_${exam.term.replace(/\s+/g, '')}_${exam.examNumber.replace(/\s+/g, '')}_Cevap_Anahtari.docx`;
    saveAs(blob, fileName);
  }

  /**
   * MEB Resmi Sınav Soru ve Kazanım Analiz Tutanağı (.docx - A4 Yatay)
   */
  static async exportExamAnalysisToWord(exam: ExamPaper, analysis: ExamItemAnalysis, settings: AppSettings): Promise<void> {
    const thinBorder = {
      top: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '888888' }
    };

    const headerBorder = {
      top: { style: BorderStyle.SINGLE, size: 2, color: '003366' },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: '003366' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '003366' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '003366' }
    };

    // 1. Soru Başarı & Kazanım Analiz Tablosu
    const questionOutcomeRows = exam.questions.map((q, idx) => {
      const successRate = analysis.questionSuccessRates[idx] || 0;
      const isAcquired = successRate >= 50;
      const avgScore = (analysis.questionAverageScores[idx] || 0).toFixed(1);

      return new TableRow({
        children: [
          new TableCell({
            width: { size: 6, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `S${q.questionNumber}`, bold: true, size: 17 })] })]
          }),
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            children: [new Paragraph({ children: [new TextRun({ text: q.learningOutcome, size: 16 })] })]
          }),
          new TableCell({
            width: { size: 12, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${q.difficulty} (${q.maxPoints} P)`, bold: true, size: 16 })] })]
          }),
          new TableCell({
            width: { size: 14, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${avgScore} / ${q.maxPoints}`, bold: true, size: 16 })] })]
          }),
          new TableCell({
            width: { size: 14, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `%${successRate}`, bold: true, size: 17, color: isAcquired ? '008000' : 'C00000' })] })]
          }),
          new TableCell({
            width: { size: 16, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            shading: { fill: isAcquired ? 'E8F5E9' : 'FFEBEE' },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: isAcquired ? 'Edinildi' : 'Kritik Eksik (Telafi)', bold: true, size: 16, color: isAcquired ? '2E7D32' : 'C62828' })] })]
          })
        ]
      });
    });

    const questionTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, shading: { fill: '0C8CE9' }, borders: headerBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Soru', bold: true, color: 'FFFFFF', size: 17 })] })] }),
            new TableCell({ width: { size: 38, type: WidthType.PERCENTAGE }, shading: { fill: '0C8CE9' }, borders: headerBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Öğrenme Çıktısı (Kazanım)', bold: true, color: 'FFFFFF', size: 17 })] })] }),
            new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, shading: { fill: '0C8CE9' }, borders: headerBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Zorluk / Puan', bold: true, color: 'FFFFFF', size: 17 })] })] }),
            new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, shading: { fill: '0C8CE9' }, borders: headerBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Sınıf Ort.', bold: true, color: 'FFFFFF', size: 17 })] })] }),
            new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, shading: { fill: '0C8CE9' }, borders: headerBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Başarı %', bold: true, color: 'FFFFFF', size: 17 })] })] }),
            new TableCell({ width: { size: 16, type: WidthType.PERCENTAGE }, shading: { fill: '0C8CE9' }, borders: headerBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Edinilme Durumu', bold: true, color: 'FFFFFF', size: 17 })] })] })
          ]
        }),
        ...questionOutcomeRows
      ]
    });

    // 2. Öğrenci Not Listesi Tablosu
    const studentRows = analysis.students.map((st, sIdx) => {
      const isPass = st.totalScore >= 50;
      return new TableRow({
        children: [
          new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, borders: thinBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${sIdx + 1}`, size: 15 })] })] }),
          new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, borders: thinBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: st.studentNo, size: 15, bold: true })] })] }),
          new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: st.studentName, size: 15, bold: true })] })] }),
          ...exam.questions.map((_, qIdx) => {
            const score = st.questionScores[qIdx] ?? 0;
            return new TableCell({
              width: { size: 5, type: WidthType.PERCENTAGE },
              borders: thinBorder,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${score}`, size: 15 })] })]
            });
          }),
          new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, borders: thinBorder, shading: { fill: isPass ? 'E8F5E9' : 'FFEBEE' }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${st.totalScore}`, bold: true, size: 16, color: isPass ? '2E7D32' : 'C62828' })] })] }),
          new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, borders: thinBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: isPass ? 'GEÇTİ' : 'KALDI', bold: true, size: 15, color: isPass ? '2E7D32' : 'C62828' })] })] })
        ]
      });
    });

    const studentScoreTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, shading: { fill: '003366' }, borders: headerBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Sıra', bold: true, color: 'FFFFFF', size: 16 })] })] }),
            new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, shading: { fill: '003366' }, borders: headerBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF', size: 16 })] })] }),
            new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, shading: { fill: '003366' }, borders: headerBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Öğrenci Adı Soyadı', bold: true, color: 'FFFFFF', size: 16 })] })] }),
            ...exam.questions.map((q) =>
              new TableCell({
                width: { size: 5, type: WidthType.PERCENTAGE },
                shading: { fill: '003366' },
                borders: headerBorder,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `S${q.questionNumber}`, bold: true, color: 'FFFFFF', size: 15 })] })]
              })
            ),
            new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, shading: { fill: '003366' }, borders: headerBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Toplam', bold: true, color: 'FFFFFF', size: 16 })] })] }),
            new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, shading: { fill: '003366' }, borders: headerBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Sonuç', bold: true, color: 'FFFFFF', size: 16 })] })] })
          ]
        }),
        ...studentRows
      ]
    });

    // 3. İstatistik & Telafi Özeti Tablosu
    const statsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: thinBorder,
              shading: { fill: 'F9FAFB' },
              children: [
                new Paragraph({ children: [new TextRun({ text: 'SINIF BAŞARI İSTATİSTİKLERİ', bold: true, size: 18, color: '003366' })] }),
                new Paragraph({ children: [new TextRun({ text: `• Sınava Katılan Öğrenci: `, bold: true, size: 16 }), new TextRun({ text: `${analysis.students.length} Kişi`, size: 16 })] }),
                new Paragraph({ children: [new TextRun({ text: `• Sınıf Başarı Ortalaması: `, bold: true, size: 16 }), new TextRun({ text: `${analysis.classAverage.toFixed(1)} Puan`, bold: true, size: 16, color: '0066CC' })] }),
                new Paragraph({ children: [new TextRun({ text: `• En Yüksek Not: `, bold: true, size: 16 }), new TextRun({ text: `${analysis.highestScore} Puan`, size: 16 })] }),
                new Paragraph({ children: [new TextRun({ text: `• En Düşük Not: `, bold: true, size: 16 }), new TextRun({ text: `${analysis.lowestScore} Puan`, size: 16 })] }),
                new Paragraph({ children: [new TextRun({ text: `• Başarılı (>=50): `, bold: true, size: 16 }), new TextRun({ text: `${analysis.passingCount} (%${((analysis.passingCount / (analysis.students.length || 1)) * 100).toFixed(0)})`, size: 16, color: '008000' })] }),
                new Paragraph({ children: [new TextRun({ text: `• Başarısız (<50): `, bold: true, size: 16 }), new TextRun({ text: `${analysis.failingCount} (%${((analysis.failingCount / (analysis.students.length || 1)) * 100).toFixed(0)})`, size: 16, color: 'C00000' })] })
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: thinBorder,
              shading: { fill: 'F9FAFB' },
              children: [
                new Paragraph({ children: [new TextRun({ text: 'KAZANIM TELAFİ VE EYLEM PLANI', bold: true, size: 18, color: 'C00000' })] }),
                new Paragraph({ children: [new TextRun({ text: 'Edinilemeyen / Kritik Eksik Kazanımlar (<%50):', bold: true, size: 16, color: 'C00000' })] }),
                ...(analysis.unacquiredOutcomes.length > 0
                  ? analysis.unacquiredOutcomes.map(o => new Paragraph({ children: [new TextRun({ text: `⚠️ ${o}`, size: 15, color: 'B71C1C' })] }))
                  : [new Paragraph({ children: [new TextRun({ text: 'Tüm sorular/kazanımlar %50 üzeri başarıyla edinilmiştir.', size: 15, color: '2E7D32', italics: true })] })]),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: 'Öğretmen Telafi Tedbiri:', bold: true, size: 16, color: '003366' })] }),
                new Paragraph({ children: [new TextRun({ text: analysis.actionPlan || 'Kritik eksik görülen öğrenme çıktıları sonraki ders saatlerinde soru-cevap ve kaynak metin tahlili ile telafi edilecektir.', size: 15, italics: true })] })
              ]
            })
          ]
        })
      ]
    });

    // 4. İmza Tablosu
    const signatureTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${settings.teacherName}`, bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tarih Dersi Öğretmeni', size: 18 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'İmza: ...........................', size: 17 })] })
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${settings.principalName}`, bold: true, size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Okul Müdürü', size: 18 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'İmza / Mühür: ...........................', size: 17 })] })
              ]
            })
          ]
        })
      ]
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: { orientation: PageOrientation.LANDSCAPE },
              margin: { top: 720, bottom: 720, left: 720, right: 720 }
            }
          },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'T.C. MİLLÎ EĞİTİM BAKANLIĞI', bold: true, size: 22, color: '003366' })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: settings.schoolName.toUpperCase(), bold: true, size: 20 })] }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${exam.academicYear} EĞİTİM ÖĞRETİM YILI ${exam.term.toUpperCase()} ${exam.gradeLevel}. SINIF (${analysis.className}) TARİH DERSİ ${exam.examNumber.toUpperCase()} SINAV SORU VE KAZANIM ANALİZ FORMU`,
                  bold: true,
                  size: 20,
                  color: 'C00000'
                })
              ]
            }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Sınav Kapsamı: ${exam.themeUnit} (${exam.scenario})`, italics: true, size: 16, color: '555555' })] }),
            new Paragraph({ text: '' }),
            new Paragraph({ children: [new TextRun({ text: '1. SORU VE ÖĞRENME ÇIKTISI (KAZANIM) BAŞARI ANALİZİ', bold: true, size: 18, color: '003366' })] }),
            questionTable,
            new Paragraph({ text: '' }),
            new Paragraph({ children: [new TextRun({ text: '2. ÖĞRENCİ PUAN VE DEĞERLENDİRME ÇİZELGESİ', bold: true, size: 18, color: '003366' })] }),
            studentScoreTable,
            new Paragraph({ text: '' }),
            statsTable,
            new Paragraph({ text: '' }),
            signatureTable
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${settings.schoolName}_Tarih_${exam.gradeLevel}Sinif_${analysis.className.replace(/[/\\s]/g, '_')}_Sinav_Analiz_Formu.docx`;
    saveAs(blob, fileName);
  }

  /**
   * MEB Maarif Modeli Tarih Performans Görevi ve Dereceli Rubrik (.docx)
   */
  static async exportPerformanceTaskToWord(task: PerformanceTaskItem, settings: AppSettings): Promise<void> {
    const thinBorder = {
      top: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '888888' }
    };

    const rubricRows = task.rubricCriteria.map((r, idx) =>
      new TableRow({
        children: [
          new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, borders: thinBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${idx + 1}`, bold: true, size: 18 })] })] }),
          new TableCell({ width: { size: 32, type: WidthType.PERCENTAGE }, borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: r.title, bold: true, size: 17 })] })] }),
          new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: r.description, size: 16 })] })] }),
          new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, borders: thinBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${r.points} Puan`, bold: true, size: 18, color: 'C00000' })] })] })
        ]
      })
    );

    const doc = new Document({
      sections: [
        {
          properties: { page: { size: { orientation: PageOrientation.PORTRAIT }, margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'T.C. MİLLÎ EĞİTİM BAKANLIĞI', bold: true, size: 22, color: '003366' })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: settings.schoolName.toUpperCase(), bold: true, size: 20 })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${task.academicYear} ${task.term.toUpperCase()} ${task.gradeLevel}. SINIF TARİH DERSİ PERFORMANS GÖREVİ VE DERECELİ PUANLAMA ANAHTARI`, bold: true, size: 20, color: '0C8CE9' })] }),
            new Paragraph({ text: '' }),
            new Paragraph({ children: [new TextRun({ text: 'GÖREV BAŞLIĞI: ', bold: true, size: 18, color: '003366' }), new TextRun({ text: task.title, bold: true, size: 18 })] }),
            new Paragraph({ children: [new TextRun({ text: 'Ünite / Öğrenme Alanı: ', bold: true, size: 16 }), new TextRun({ text: task.themeUnit, size: 16 })] }),
            new Paragraph({ children: [new TextRun({ text: 'Görevin Amacı: ', bold: true, size: 16 }), new TextRun({ text: task.objective, size: 16 })] }),
            new Paragraph({ children: [new TextRun({ text: 'Hazırlama Süresi: ', bold: true, size: 16 }), new TextRun({ text: `${task.deadlineWeeks} Hafta`, bold: true, size: 16 })] }),
            new Paragraph({ children: [new TextRun({ text: 'Teslim Formatı: ', bold: true, size: 16 }), new TextRun({ text: task.submissionFormat, size: 16 })] }),
            new Paragraph({ text: '' }),
            new Paragraph({ children: [new TextRun({ text: 'GÖREV BASAMAKLARI VE YÖNERGE:', bold: true, size: 18, color: '003366' })] }),
            ...task.steps.map((st, i) => new Paragraph({ children: [new TextRun({ text: `${i + 1}. `, bold: true, size: 16 }), new TextRun({ text: st, size: 16 })] })),
            new Paragraph({ text: '' }),
            new Paragraph({ children: [new TextRun({ text: 'DERECELİ PUANLAMA ANAHTARI (RUBRİK):', bold: true, size: 18, color: '003366' })] }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  tableHeader: true,
                  children: [
                    new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, shading: { fill: '0C8CE9' }, borders: thinBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF', size: 17 })] })] }),
                    new TableCell({ width: { size: 32, type: WidthType.PERCENTAGE }, shading: { fill: '0C8CE9' }, borders: thinBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Değerlendirme Ölçütü', bold: true, color: 'FFFFFF', size: 17 })] })] }),
                    new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, shading: { fill: '0C8CE9' }, borders: thinBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ölçüt Açıklaması', bold: true, color: 'FFFFFF', size: 17 })] })] }),
                    new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, shading: { fill: '0C8CE9' }, borders: thinBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Puan', bold: true, color: 'FFFFFF', size: 17 })] })] })
                  ]
                }),
                ...rubricRows
              ]
            }),
            new Paragraph({ text: '' }),
            new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${settings.teacherName} • Tarih Dersi Öğretmeni`, bold: true, size: 18 })] })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${settings.schoolName}_Tarih_${task.gradeLevel}Sinif_Performans_Gorevi.docx`;
    saveAs(blob, fileName);
  }

  /**
   * MEB Tarih Zümre Öğretmenler Kurulu Toplantı Tutanağı (.docx)
   */
  static async exportDepartmentMinutesToWord(minutes: DepartmentMinutesItem, settings: AppSettings): Promise<void> {
    const thinBorder = {
      top: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '888888' }
    };

    const doc = new Document({
      sections: [
        {
          properties: { page: { size: { orientation: PageOrientation.PORTRAIT }, margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'T.C. MİLLÎ EĞİTİM BAKANLIĞI', bold: true, size: 22, color: '003366' })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: settings.schoolName.toUpperCase(), bold: true, size: 20 })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${minutes.academicYear} EĞİTİM ÖĞRETİM YILI TARİH ZÜMRE ÖĞRETMENLER KURULU TOPLANTI TUTANAĞI`, bold: true, size: 20, color: '0C8CE9' })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `(${minutes.title})`, bold: true, size: 18, color: '555555' })] }),
            new Paragraph({ text: '' }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Toplantı Tarihi & Yeri:', bold: true, size: 16 })] })] }),
                    new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `${minutes.meetingDate} - ${minutes.meetingPlace}`, size: 16 })] })] })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Zümre Başkanı / Öğretmen:', bold: true, size: 16 })] })] }),
                    new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: settings.teacherName, bold: true, size: 16 })] })] })
                  ]
                })
              ]
            }),
            new Paragraph({ text: '' }),
            new Paragraph({ children: [new TextRun({ text: 'GÜNDEM MADDELERİ:', bold: true, size: 18, color: '003366' })] }),
            ...minutes.agendaItems.map((item, i) => new Paragraph({ children: [new TextRun({ text: `${i + 1}. `, bold: true, size: 16 }), new TextRun({ text: item, size: 16 })] })),
            new Paragraph({ text: '' }),
            new Paragraph({ children: [new TextRun({ text: 'GÜNDEM MADDELERİNİN GÖRÜŞÜLMESİ VE ALINAN KARARLAR:', bold: true, size: 18, color: '003366' })] }),
            ...minutes.decisions.map((dec, i) => new Paragraph({ children: [new TextRun({ text: `Karar ${i + 1}: `, bold: true, size: 16, color: '003366' }), new TextRun({ text: dec, size: 16 })] })),
            new Paragraph({ text: '' }),
            new Paragraph({ text: '' }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                      children: [
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: settings.teacherName, bold: true, size: 19 })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tarih Dersi Öğretmeni / Zümre Başkanı', size: 17 })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'İmza: .............................', size: 16 })] })
                      ]
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                      children: [
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'UYGUNDUR', bold: true, size: 18, color: '003366' })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: settings.principalName, bold: true, size: 19 })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Okul Müdürü', size: 17 })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'İmza / Mühür: .............................', size: 16 })] })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${settings.schoolName}_Tarih_Zumre_Tutanagi_${minutes.meetingType}.docx`;
    saveAs(blob, fileName);
  }
}

