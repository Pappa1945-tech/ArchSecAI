document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatContainer = document.getElementById('chat-container');
    const sendButton = document.getElementById('send-button');
    const sendIcon = document.getElementById('send-icon');
    const loadingIcon = document.getElementById('loading-icon');

    // Setup Marked.js options
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: false
    });

    // Auto-resize textarea
    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value.trim() === '') {
            this.style.height = 'auto'; // Reset when cleared
        }
    });

    // Submit on Enter (prevent default newline), allow Shift+Enter for newline
    messageInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (!message) return;

        // Reset input immediately
        messageInput.value = '';
        messageInput.style.height = 'auto';

        // Add User Message to UI
        appendUserMessage(message);

        // Show loading state
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            // Remove typing indicator if exists
            const typingInd = document.getElementById('typing-indicator');
            if (typingInd) typingInd.remove();

            // Add AI response to UI
            appendAIMessage(data.response);

        } catch (error) {
            console.error('Error:', error);
            const typingInd = document.getElementById('typing-indicator');
            if (typingInd) typingInd.remove();

            appendAIMessage('**System Error:** Communication with the local LLM failed. Please ensure Ollama is running (`ollama serve`).');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            sendIcon.classList.add('hidden');
            loadingIcon.classList.remove('hidden');
            sendButton.disabled = true;
            sendButton.classList.add('opacity-50', 'cursor-not-allowed');
            messageInput.disabled = true;
            appendTypingIndicator();
        } else {
            sendIcon.classList.remove('hidden');
            loadingIcon.classList.add('hidden');
            sendButton.disabled = false;
            sendButton.classList.remove('opacity-50', 'cursor-not-allowed');
            messageInput.disabled = false;
            messageInput.focus();
        }
    }

    function appendUserMessage(text) {
        const wrapper = document.createElement('div');
        wrapper.className = 'flex gap-4 w-full justify-end max-w-4xl mx-auto mb-6 message-appear';

        wrapper.innerHTML = `
            <div class="glass-user-message rounded-2xl p-5 text-sm md:text-base leading-relaxed text-gray-200 max-w-[85%] order-1">
                <p class="whitespace-pre-wrap">${escapeHTML(text)}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center shrink-0 order-2">
                <i class="fas fa-user text-gray-400 text-sm"></i>
            </div>
        `;

        chatContainer.appendChild(wrapper);
        scrollToBottom();
    }

    function appendAIMessage(markdownText) {
        const wrapper = document.createElement('div');
        wrapper.className = 'flex gap-4 w-full max-w-4xl mx-auto mb-6 message-appear';

        const htmlContent = marked.parse(markdownText);

        wrapper.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-red-900/50 border border-red-500/30 flex items-center justify-center shrink-0 mt-1">
                <i class="fas fa-robot text-red-500 text-sm"></i>
            </div>
            <div class="glass-message rounded-2xl p-5 text-sm md:text-base leading-relaxed text-gray-300 w-full markdown-content overflow-hidden">
                ${htmlContent}
            </div>
        `;

        chatContainer.appendChild(wrapper);
        scrollToBottom();
    }

    function appendTypingIndicator() {
        const wrapper = document.createElement('div');
        wrapper.id = 'typing-indicator';
        wrapper.className = 'flex gap-4 w-full max-w-4xl mx-auto mb-6 message-appear';

        wrapper.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-red-900/50 border border-red-500/30 flex items-center justify-center shrink-0">
                <i class="fas fa-robot text-red-500 text-sm"></i>
            </div>
            <div class="glass-message rounded-2xl p-4 flex items-center">
                <div class="typing-indicator flex">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;

        chatContainer.appendChild(wrapper);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
