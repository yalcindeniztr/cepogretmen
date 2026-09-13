package com.example.util

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.pdf.PdfDocument
import android.os.Environment
import android.widget.Toast
import com.example.data.local.entity.PlanEntity
import com.example.data.local.entity.SettingsEntity
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

object PdfGenerator {
    fun generatePlanPdf(context: Context, plan: PlanEntity, settings: SettingsEntity?) {
        val document = PdfDocument()
        val pageInfo = PdfDocument.PageInfo.Builder(595, 842, 1).create() // A4 size
        val page = document.startPage(pageInfo)
        val canvas: Canvas = page.canvas
        val paint = Paint()

        var yPosition = 50f
        val xPosition = 50f
        val lineSpacing = 25f

        paint.textSize = 20f
        paint.isFakeBoldText = true
        paint.color = Color.BLACK
        
        val titleText = if (plan.type.name == "YEARLY") "YILLIK DERS PLANI" else "GÜNLÜK DERS PLANI"
        canvas.drawText(titleText, xPosition, yPosition, paint)
        yPosition += lineSpacing * 2

        paint.textSize = 12f
        paint.isFakeBoldText = false

        settings?.let {
            canvas.drawText("Okul: ${it.schoolName}", xPosition, yPosition, paint)
            yPosition += lineSpacing
            canvas.drawText("Öğretmen: ${it.teacherName}", xPosition, yPosition, paint)
            yPosition += lineSpacing
            canvas.drawText("Müdür: ${it.principalName}", xPosition, yPosition, paint)
            yPosition += lineSpacing
            canvas.drawText("Eğitim Yılı: ${it.academicYear}", xPosition, yPosition, paint)
            yPosition += lineSpacing * 2
        }

        canvas.drawText("Sınıf: ${plan.gradeLevel}. Sınıf", xPosition, yPosition, paint)
        yPosition += lineSpacing
        canvas.drawText("Konu/Ünite: ${plan.title}", xPosition, yPosition, paint)
        yPosition += lineSpacing
        canvas.drawText("Tarih/Hafta: ${plan.dateRange} (${plan.weekNumber}. Hafta)", xPosition, yPosition, paint)
        yPosition += lineSpacing * 2

        val sections = listOf(
            "Kazanımlar" to plan.outcomes,
            "Değerler" to plan.values,
            "Öğrenme Süreçleri" to plan.learningProcesses,
            "Değerlendirme" to plan.evaluation,
            "Kaynaklar (MEB, EBA, OGM vs.)" to plan.resources
        )

        for ((sectionTitle, content) in sections) {
            paint.isFakeBoldText = true
            canvas.drawText(sectionTitle, xPosition, yPosition, paint)
            yPosition += lineSpacing
            paint.isFakeBoldText = false
            
            // Simple text wrapping simulation
            val words = content.split(" ")
            var currentLine = ""
            for (word in words) {
                if (paint.measureText("$currentLine $word") < 495f) {
                    currentLine += "$word "
                } else {
                    canvas.drawText(currentLine, xPosition, yPosition, paint)
                    yPosition += lineSpacing
                    currentLine = "$word "
                }
            }
            if (currentLine.isNotBlank()) {
                canvas.drawText(currentLine, xPosition, yPosition, paint)
                yPosition += lineSpacing
            }
            yPosition += lineSpacing
        }

        document.finishPage(page)

        try {
            val fileName = "MaarifPlan_${plan.id}.pdf"
            val file = File(context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), fileName)
            document.writeTo(FileOutputStream(file))
            Toast.makeText(context, "PDF Kaydedildi: ${file.absolutePath}", Toast.LENGTH_LONG).show()
        } catch (e: IOException) {
            e.printStackTrace()
            Toast.makeText(context, "PDF Kaydedilemedi", Toast.LENGTH_SHORT).show()
        }

        document.close()
    }
}
