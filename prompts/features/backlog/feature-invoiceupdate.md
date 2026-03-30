# Update to Invoice feature
**structure**, **styling**, and **print-readability** (since invoices are often saved as PDFs). 

### Update invoice feature instead of tracktracking weekly to monthly submission
> "Create a clean, professional, and minimalist **single-page HTML and CSS invoice** for an Information Consultant. 
>
> **Layout Requirements:**
> 1.  **Header:** My business contact details on the left, Client details on the right.
> 2.  **Section 1 (Top - Payment Summary):** A high-visibility 'Payment Summary' box. It should show: Description (Consulting Services), Hourly Rate, Total Hours, and a bold **'Total Amount Due'**.
> 3.  **Section 2 (Middle - Payment Instructions):** A simple list for Bank Name, Account Name, Account Number, and Routing/IBAN.
> 4.  **Section 3 (Bottom - Service Summary):** A table showing a weekly breakdown of hours (Week 1 through Week 4) with a column for 'Primary Focus/Deliverables' and 'Hours'. 
> 5.  **Invoice Number:** A auto geberated invoice number in format "NXION-{MONTH}-{Year}, month will based on selected month the invoice getting created for the year.
>
> **Design Requirements:**
> * Use a modern sans-serif font (like Inter or Arial).
> * Use a monochromatic color scheme (Greys, Blacks, and maybe one accent color like Navy Blue).
> * Ensure the design is **mobile-responsive** but also optimized for **A4 Print/PDF** (use `@media print` CSS rules to hide any unnecessary UI elements).
> * Use subtle borders and generous whitespace for a 'premium' consulting feel.
>
> **Technical:** Please provide the HTML and CSS in a single file for easy saving."

---

### **What this prompt will produce for you:**

* **Priority Ranking:** It ensures the "Money" (Total Due) is the first thing the client sees.
* **Professionalism:** It avoids "clunky" default HTML tables and uses modern CSS spacing.
* **Utility:** By asking for `@media print` rules, the "Save to PDF" function in your browser will automatically format it perfectly for an email attachment without cutting off text.

**Would you like me to generate the actual HTML code for you right now based on this prompt, or would you prefer to use this in a different coding tool?**