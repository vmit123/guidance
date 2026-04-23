class AdvancedChatbot {
    constructor() {
        this.conversation_memory = {}; // Map user_id to array of last 10 interactions
        this.user_preferences = {};
        this.learning_data = {};
        this.emotion_keywords = {
            'positive': ['happy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'love', 'like'],
            'negative': ['sad', 'worried', 'confused', 'frustrated', 'angry', 'disappointed', 'hate', 'difficult'],
            'neutral': ['okay', 'fine', 'alright', 'normal', 'regular', 'standard']
        };
        
        this.intent_patterns = {
            'greeting': {
                'patterns': [
                    /\b(hello|hi|hey|good morning|good afternoon|good evening)\b/i,
                    /\b(how are you|how do you do)\b/i,
                    /\b(nice to meet you|pleased to meet you)\b/i
                ],
                'weight': 0.9,
                'responses': [
                    "Hello! I'm your advanced AI assistant. How can I help you today?",
                    "Hi there! I'm here to assist you with career guidance and educational planning.",
                    "Welcome! I can help you with colleges, scholarships, and career advice."
                ]
            },
            'colleges': {
                'patterns': [
                    /\b(college|university|institution|admission|courses|degree)\b/i,
                    /\b(engineering|medical|arts|commerce|science)\b/i,
                    /\b(jammu|srinagar|kashmir|district)\b/i,
                    /\b(undergraduate|postgraduate|bachelor|master)\b/i
                ],
                'weight': 0.8,
                'responses': [
                    "I can help you find the perfect college! What field of study interests you?",
                    "Let me assist you with college information. Are you looking for specific courses or locations?",
                    "I have detailed information about colleges across J&K. What would you like to know?"
                ]
            },
            'scholarships': {
                'patterns': [
                    /\b(scholarship|financial aid|funding|grant|money|tuition)\b/i,
                    /\b(merit|need-based|government|private)\b/i,
                    /\b(afford|expensive|cost|fee)\b/i
                ],
                'weight': 0.8,
                'responses': [
                    "I can help you find scholarships! What's your current education level?",
                    "Let me search for funding opportunities. Are you looking for merit-based or need-based scholarships?",
                    "I have information about various scholarship programs. What field of study are you pursuing?"
                ]
            },
            'career_guidance': {
                'patterns': [
                    /\b(career|job|profession|future|what should i do)\b/i,
                    /\b(aptitude|quiz|test|guidance|counseling)\b/i,
                    /\b(confused|unsure|don't know|help me decide)\b/i
                ],
                'weight': 0.8,
                'responses': [
                    "I can help you discover your career path! Let's start with your interests and strengths.",
                    "Career planning is exciting! What subjects or activities do you enjoy most?",
                    "I'll help you find the perfect career match. Are you ready to take our aptitude test?"
                ]
            },
            'emotional_support': {
                'patterns': [
                    /\b(stressed|anxious|worried|nervous|scared)\b/i,
                    /\b(difficult|hard|challenging|struggling)\b/i,
                    /\b(help|support|advice|guidance)\b/i
                ],
                'weight': 0.7,
                'responses': [
                    "I understand this can be overwhelming. You're not alone - I'm here to help you through this.",
                    "It's completely normal to feel this way. Let's take it one step at a time.",
                    "I'm here to support you. What specific aspect would you like help with?"
                ]
            }
        };
        
        this.context_responses = {
            'follow_up': {
                'colleges': "Based on our previous discussion about colleges, would you like to know about admission requirements or specific courses?",
                'scholarships': "Since we talked about scholarships, are you interested in application deadlines or eligibility criteria?",
                'career': "Following up on our career discussion, would you like to explore specific job opportunities or skill requirements?"
            },
            'clarification': "I want to make sure I understand correctly. Are you asking about {topic}?",
            'encouragement': "That's a great question! Let me help you with that.",
            'proactive': "Based on what you've told me, I think you might also be interested in {suggestion}."
        };
    }

    _getConversationMemory(userId) {
        if (!this.conversation_memory[userId]) {
            this.conversation_memory[userId] = [];
        }
        return this.conversation_memory[userId];
    }

    _getLearningData(userId) {
        if (!this.learning_data[userId]) {
            this.learning_data[userId] = [];
        }
        return this.learning_data[userId];
    }

    detect_emotion(text) {
        const text_lower = text.toLowerCase();
        let emotion_scores = {};
        
        for (const [emotion, keywords] of Object.entries(this.emotion_keywords)) {
            let score = 0;
            for (const keyword of keywords) {
                if (text_lower.includes(keyword)) {
                    score += 1;
                }
            }
            emotion_scores[emotion] = score;
        }
        
        let max_score = Math.max(...Object.values(emotion_scores));
        if (Object.keys(emotion_scores).length === 0 || max_score === 0) {
            return 'neutral';
        }
        
        return Object.keys(emotion_scores).find(key => emotion_scores[key] === max_score);
    }

    calculate_intent_confidence(text, intent) {
        const patterns = this.intent_patterns[intent].patterns;
        let matches = 0;
        const total_patterns = patterns.length;
        
        for (const pattern of patterns) {
            if (pattern.test(text)) {
                matches += 1;
            }
        }
        
        let base_confidence = matches / total_patterns;
        const weight = this.intent_patterns[intent].weight;
        
        if (matches > 1) {
            base_confidence *= 1.2;
        }
        
        return Math.min(base_confidence * weight, 1.0);
    }

    detect_intent_advanced(text, userId = "default") {
        const recent_messages = [...this._getConversationMemory(userId)];
        
        let intent_scores = {};
        for (const intent in this.intent_patterns) {
            let confidence = this.calculate_intent_confidence(text, intent);
            
            if (recent_messages.length > 0) {
                const last_intent = this._extract_intent_from_history(recent_messages[recent_messages.length - 1]);
                if (intent === last_intent) {
                    confidence *= 1.3;
                }
            }
            
            intent_scores[intent] = confidence;
        }
        
        let best_intent = Object.keys(intent_scores).reduce((a, b) => intent_scores[a] > intent_scores[b] ? a : b);
        let best_confidence = intent_scores[best_intent];
        
        if (best_confidence < 0.3 && recent_messages.length > 0) {
            const context_intent = this._infer_from_context(text, recent_messages);
            if (context_intent) {
                return [context_intent, 0.6];
            }
        }
        
        return [best_intent, best_confidence];
    }

    _extract_intent_from_history(message) {
        return message.intent || null;
    }

    _infer_from_context(text, history) {
        const follow_up_words = ['also', 'and', 'what about', 'how about', 'tell me more', 'more about'];
        const text_lower = text.toLowerCase();
        
        if (follow_up_words.some(word => text_lower.includes(word))) {
            for (let i = history.length - 1; i >= 0; i--) {
                if (history[i].intent) {
                    return history[i].intent;
                }
            }
        }
        return null;
    }

    generate_contextual_response(intent, text, userId = "default", emotion = "neutral") {
        const recent_messages = [...this._getConversationMemory(userId)];
        
        const base_responses = this.intent_patterns[intent].responses;
        let response = base_responses[Math.floor(Math.random() * base_responses.length)];
        
        if (emotion === 'negative') {
            response = `I understand this might be challenging. ${response}`;
        } else if (emotion === 'positive') {
            response = `That's exciting! ${response}`;
        }
        
        if (recent_messages.length > 0) {
            const last_intent = this._extract_intent_from_history(recent_messages[recent_messages.length - 1]);
            if (last_intent === intent) {
                const follow_up = this.context_responses.follow_up[intent];
                if (follow_up) {
                    response += ` ${follow_up}`;
                }
            }
        }
        
        if (['colleges', 'scholarships', 'career_guidance'].includes(intent)) {
            const suggestion = this._get_proactive_suggestion(intent, recent_messages);
            if (suggestion) {
                response += ` ${this.context_responses.proactive.replace('{suggestion}', suggestion)}`;
            }
        }
        
        return response;
    }

    _get_proactive_suggestion(intent, history) {
        const suggestions = {
            'colleges': 'scholarship opportunities for your chosen field',
            'scholarships': 'career guidance to help you plan your future',
            'career_guidance': 'specific colleges that offer programs in your area of interest'
        };
        return suggestions[intent] || null;
    }

    learn_from_interaction(userId, user_message, bot_response, intent, confidence) {
        const interaction = {
            timestamp: new Date(),
            user_message,
            bot_response,
            intent,
            confidence
        };
        
        const data = this._getLearningData(userId);
        data.push(interaction);
        
        if (data.length > 50) {
            data.splice(0, data.length - 50);
        }
    }

    get_personalized_response(userId, text) {
        const emotion = this.detect_emotion(text);
        const [intent, confidence] = this.detect_intent_advanced(text, userId);
        const response = this.generate_contextual_response(intent, text, userId, emotion);
        
        const conversation_entry = {
            timestamp: new Date(),
            user_message: text,
            intent,
            confidence,
            emotion
        };
        
        const mem = this._getConversationMemory(userId);
        mem.push(conversation_entry);
        if (mem.length > 10) mem.shift();
        
        this.learn_from_interaction(userId, text, response, intent, confidence);
        
        return {
            response,
            intent,
            confidence,
            emotion,
            context_aware: mem.length > 1
        };
    }

    get_user_insights(userId) {
        if (!this.learning_data[userId] || this.learning_data[userId].length === 0) {
            return { message: "No data available yet" };
        }
        
        const interactions = this.learning_data[userId];
        const intent_counts = {};
        
        for (const interaction of interactions) {
            intent_counts[interaction.intent] = (intent_counts[interaction.intent] || 0) + 1;
        }
        
        const top_interests = Object.entries(intent_counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
            
        return {
            total_interactions: interactions.length,
            top_interests: top_interests,
            recent_emotions: interactions.slice(-5).map(i => i.emotion),
            conversation_length: this._getConversationMemory(userId).length
        };
    }
}

const advanced_chatbot = new AdvancedChatbot();

module.exports = {
    advanced_chatbot
};
