# Install reportlab if not installed:
# pip install reportlab

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

# Output PDF file name (saved in /sdcard/)
file_path = "/sdcard/Gurram_Karthikeya_Resume.pdf"

# Create PDF document
doc = SimpleDocTemplate(file_path, pagesize=A4,
                        rightMargin=40, leftMargin=40,
                        topMargin=30, bottomMargin=30)

# Styles
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Heading', fontSize=12, leading=14, spaceAfter=6, fontName="Helvetica-Bold"))
styles.add(ParagraphStyle(name='SubHeading', fontSize=11, leading=13, spaceAfter=4, fontName="Helvetica-Bold"))
styles.add(ParagraphStyle(name='Content', fontSize=10, leading=12, spaceAfter=3))
styles.add(ParagraphStyle(name='TitleCustom', fontSize=16, leading=18, alignment=1, fontName="Helvetica-Bold"))

# Content
content = []

# Title
content.append(Paragraph("GURRAM KARTHIKEYA", styles['TitleCustom']))
content.append(Paragraph("📍 Jagtial, Telangana | 📞 +91 8688496208 | ✉️ karthikyanethar7@gmail.com", styles['Content']))

# ✅ Clickable LinkedIn & GitHub
content.append(Paragraph(
    '🔗 <a href="https://www.linkedin.com/in/gurram-karthikeya" color="blue">LinkedIn</a> | '
    '🔗 <a href="https://github.com/Karthikeyanetha1" color="blue">GitHub</a>',
    styles['Content']
))
content.append(Spacer(1, 12))

# Professional Summary
content.append(Paragraph("PROFESSIONAL SUMMARY", styles['Heading']))
content.append(Paragraph(
    "Enthusiastic and detail-oriented B.Tech CSE (AI & ML) student with strong problem-solving skills and a passion "
    "for developing efficient, user-focused software solutions. Skilled in full-stack web development, AI/ML concepts, "
    "and database integration. Adept at working on projects from concept to deployment with a focus on functionality and performance.",
    styles['Content']))
content.append(Spacer(1, 12))

# Education
content.append(Paragraph("EDUCATION", styles['Heading']))
education_data = [
    ["St. Mary’s Engineering College, Hyderabad — B.Tech in Computer Science (AI & ML)", "2022 – 2026 | Current CGPA: —"],
    ["Sri Chaitanya Junior College, Jagtial — Intermediate (MPC)", "2020 – 2022 | 63%"],
    ["Gouthama High School, Jagtial — SSC", "2019 – 2020 | 98%"]
]
table = Table(education_data, colWidths=[350, 150])
table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                           ("TEXTCOLOR", (0, 0), (-1, -1), colors.black),
                           ("FONTSIZE", (0, 0), (-1, -1), 10),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
content.append(table)
content.append(Spacer(1, 12))

# Projects
content.append(Paragraph("PROJECTS", styles['Heading']))
content.append(Paragraph("<b>Box Cricket Booking System</b> | React.js, Node.js, Express.js, MongoDB Atlas", styles['SubHeading']))
content.append(Paragraph("• Developed a mobile-friendly web application for booking and managing box cricket slots.", styles['Content']))
content.append(Paragraph("• Implemented features for slot availability viewing, online booking, and on-site payment.", styles['Content']))
content.append(Paragraph("• Integrated MongoDB Atlas for secure, persistent booking storage.", styles['Content']))
content.append(Paragraph("• Built RESTful APIs for seamless frontend-backend communication.", styles['Content']))
content.append(Spacer(1, 12))

# Skills
content.append(Paragraph("SKILLS", styles['Heading']))
content.append(Paragraph("Programming: C, C++, Python, Java, JavaScript (ES6+)", styles['Content']))
content.append(Paragraph("Web Development: HTML, CSS, React.js, Node.js, Express.js", styles['Content']))
content.append(Paragraph("Database: MongoDB Atlas, MySQL", styles['Content']))
content.append(Paragraph("Tools & Platforms: Git, GitHub, VS Code, Termux, Google Cloud", styles['Content']))
content.append(Paragraph("Areas of Interest: Artificial Intelligence, Machine Learning, Web Application Development", styles['Content']))
content.append(Spacer(1, 12))

# Achievements
content.append(Paragraph("ACHIEVEMENTS", styles['Heading']))
content.append(Paragraph("• Successfully deployed full-stack Box Cricket Booking System with MongoDB integration.", styles['Content']))
content.append(Paragraph("• Consistently scored top grades in core programming and web development subjects.", styles['Content']))
content.append(Spacer(1, 12))

# ✅ Build the PDF
doc.build(content)

print("✅ Resume created successfully at:", file_path)
