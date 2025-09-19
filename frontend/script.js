document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('planForm');
    const outputDiv = document.getElementById('output');
    const outputContainer = document.getElementById('outputContainer');
    const loadingDiv = document.getElementById('loading');
    const debugInfoDiv = document.getElementById('debugInfo');
    const debugToggle = document.getElementById('debugToggle');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    let debugVisible = false;
    let currentLessonPlan = '';

    // Toggle debug info visibility
    debugToggle.addEventListener('click', function() {
        debugVisible = !debugVisible;
        debugInfoDiv.style.display = debugVisible ? 'block' : 'none';
        debugToggle.textContent = debugVisible ? 'Hide Debug' : 'Show Debug';
    });

    // Download as PDF
    downloadBtn.addEventListener('click', function() {
        const date = new Date().toLocaleDateString();
        const title = document.getElementById('theme').value;
        
        // Create a styled container for PDF
        const pdfContent = document.createElement('div');
        pdfContent.style.cssText = `
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            color: #2c3e50;
        `;
        
        // Add header
        const header = document.createElement('div');
        header.innerHTML = `
            <h1 style="color: #2E8B57; margin-bottom: 10px;">${title} - Lesson Plan</h1>
            <p style="color: #666; margin-bottom: 30px;">Generated on ${date}</p>
        `;
        pdfContent.appendChild(header);
        
        // Add formatted lesson plan content
        const content = document.createElement('div');
        content.innerHTML = outputDiv.innerHTML;
        content.style.cssText = `
            line-height: 1.6;
            font-size: 12pt;
        `;
        pdfContent.appendChild(content);
        
        // PDF generation options
        const opt = {
            margin: [15, 15, 15, 15],
            filename: `${title.toLowerCase().replace(/\s+/g, '-')}-lesson-plan.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait'
            }
        };

        html2pdf().from(pdfContent).set(opt).save();
    });

    // Copy to clipboard with formatting
    copyBtn.addEventListener('click', function() {
        const htmlContent = outputDiv.innerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const clipboardItem = new ClipboardItem({ 'text/html': blob });
        
        navigator.clipboard.write([clipboardItem]).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback to plain text if HTML copy fails
            navigator.clipboard.writeText(outputDiv.innerText);
        });
    });

    // Enhanced Markdown to HTML converter
    function formatLessonPlan(rawText) {
        let text = rawText;
        // Headings
        text = text.replace(/^\s*### (.*)$/gm, '<h3>$1</h3>');
        text = text.replace(/^\s*## (.*)$/gm, '<h2>$1</h2>');
        text = text.replace(/^\s*# (.*)$/gm, '<h1>$1</h1>');
        // Bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Lists
        text = text.replace(/(^|<br>)\s*\- (.*?)(?=<br>|$)/g, '$1<li>$2</li>');
        text = text.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
        // Numbered lists
        text = text.replace(/(^|<br>)\s*\d+\. (.*?)(?=<br>|$)/g, '$1<ol><li>$2</li></ol>');
        // Resources
        text = text.replace(/\*Resources:\*/g, '<strong>Resources:</strong>');
        // Line breaks
        text = text.replace(/\n/g, '<br>');
        return text;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        outputDiv.innerHTML = '';
        debugInfoDiv.innerHTML = '';
        loadingDiv.style.display = 'block';
        outputContainer.classList.add('hidden');

        const formData = new FormData(form);
        const data = {
            theme: formData.get('theme'),
            ageGroup: formData.get('ageGroup'),
            duration: formData.get('duration'),
            learningArea: formData.get('learningArea'),
            additionalNotes: formData.get('additionalNotes')
        };

        debugInfoDiv.innerHTML += `Sending request to n8n...\n`;
        debugInfoDiv.innerHTML += `Request data: ${JSON.stringify(data, null, 2)}\n\n`;

        try {
            
            await new Promise(resolve => setTimeout(resolve, 1500));
   
            // const response = await fetch('https://henrylam3.app.n8n.cloud/webhook-test/lesson-planner', {
            const response = await fetch('https://henrylam3.app.n8n.cloud/webhook/lesson-planner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            debugInfoDiv.innerHTML += `Response status: ${response.status} ${response.statusText}\n`;
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            
            debugInfoDiv.innerHTML += `Full response: ${JSON.stringify(result, null, 2)}\n\n`;

            let lessonText = result.generatedPlan || result.response || result.content || 
                           (result.message && result.message.content) || 
                           (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content);
            
            if (lessonText) {
                currentLessonPlan = lessonText;
                outputDiv.innerHTML = formatLessonPlan(lessonText);
                outputContainer.classList.remove('hidden');
                outputContainer.classList.add('fade-in');
                debugInfoDiv.innerHTML += `✅ Successfully received and displayed lesson plan\n`;
                
                // Scroll to output
                outputContainer.scrollIntoView({ behavior: 'smooth' });
            } else {
                outputDiv.innerHTML = "Error: The response format from n8n is unexpected. Please check the debug info for details.";
                debugInfoDiv.innerHTML += `❌ Unexpected response format from n8n\n`;
            }
        } catch (error) {
            console.error('Error:', error);
            outputDiv.innerHTML = "Failed to generate plan. Please check your connection and try again.";
            debugInfoDiv.innerHTML += `❌ Error: ${error.message}\n`;
        } finally {
            loadingDiv.style.display = 'none';
        }
    });
});