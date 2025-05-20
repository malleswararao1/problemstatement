        // In-memory database for flashcards
        const flashcardsDB = [];
        
        // Subject classification keywords
        const subjectKeywords = {
            'Physics': ['force', 'newton', 'gravity', 'motion', 'energy', 'mass', 'acceleration', 'velocity', 'momentum', 'quantum', 'relativity', 'electromagnetic', 'wave', 'particle', 'atom', 'nuclear'],
            'Biology': ['cell', 'dna', 'organism', 'evolution', 'species', 'photosynthesis', 'respiration', 'gene', 'protein', 'enzyme', 'chromosome', 'mitosis', 'meiosis', 'ecosystem', 'biodiversity'],
            'Chemistry': ['element', 'compound', 'molecule', 'reaction', 'acid', 'base', 'periodic', 'bond', 'solution', 'electron', 'proton', 'neutron', 'organic', 'inorganic', 'catalyst', 'oxidation'],
            'Mathematics': ['equation', 'function', 'algebra', 'calculus', 'geometry', 'theorem', 'proof', 'number', 'integral', 'derivative', 'matrix', 'vector', 'probability', 'statistics', 'polynomial'],
            'History': ['war', 'revolution', 'empire', 'civilization', 'president', 'king', 'queen', 'century', 'ancient', 'medieval', 'modern', 'world war', 'cold war', 'dynasty', 'democracy'],
            'Literature': ['novel', 'poem', 'author', 'character', 'plot', 'theme', 'metaphor', 'symbolism', 'genre', 'narrative', 'fiction', 'prose', 'poetry', 'drama', 'shakespeare'],
            'Geography': ['continent', 'country', 'ocean', 'river', 'mountain', 'climate', 'map', 'population', 'city', 'capital', 'latitude', 'longitude', 'hemisphere', 'equator', 'terrain'],
            'Computer Science': ['algorithm', 'programming', 'database', 'network', 'software', 'hardware', 'internet', 'code', 'data', 'binary', 'encryption', 'compiler', 'operating system', 'api', 'cloud']
        };
        
        // Subject badge colors
        const subjectColors = {
            'Physics': 'bg-purple-100 text-purple-800',
            'Biology': 'bg-green-100 text-green-800',
            'Chemistry': 'bg-yellow-100 text-yellow-800',
            'Mathematics': 'bg-blue-100 text-blue-800',
            'History': 'bg-red-100 text-red-800',
            'Literature': 'bg-pink-100 text-pink-800',
            'Geography': 'bg-indigo-100 text-indigo-800',
            'Computer Science': 'bg-teal-100 text-teal-800',
            'Other': 'bg-gray-100 text-gray-800'
        };
        
        // Function to classify subject based on question and answer text
        function classifySubject(question, answer) {
            const combinedText = (question + ' ' + answer).toLowerCase();
            
            let maxScore = 0;
            let detectedSubject = 'Other';
            
            for (const [subject, keywords] of Object.entries(subjectKeywords)) {
                let score = 0;
                for (const keyword of keywords) {
                    if (combinedText.includes(keyword.toLowerCase())) {
                        score++;
                    }
                }
                
                if (score > maxScore) {
                    maxScore = score;
                    detectedSubject = subject;
                }
            }
            
            return detectedSubject;
        }
        
        // Add flashcard endpoint
        document.getElementById('add-flashcard').addEventListener('click', function() {
            const studentId = document.getElementById('student_id').value.trim();
            const question = document.getElementById('question').value.trim();
            const answer = document.getElementById('answer').value.trim();
            const resultDiv = document.getElementById('add-result');
            
            if (!studentId || !question || !answer) {
                resultDiv.textContent = 'Please fill in all fields';
                resultDiv.className = 'mt-4 p-3 rounded-md bg-red-100 text-red-800';
                resultDiv.classList.remove('hidden');
                return;
            }
            
            const subject = classifySubject(question, answer);
            
            // Add to database
            flashcardsDB.push({
                student_id: studentId,
                question: question,
                answer: answer,
                subject: subject
            });
            
            // Show success message
            resultDiv.innerHTML = `
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium">Flashcard added successfully</p>
                        <p>Subject: <span class="font-semibold">${subject}</span></p>
                    </div>
                    <div class="ml-4">
                        <span class="inline-block px-2 py-1 rounded-full ${subjectColors[subject]}">${subject}</span>
                    </div>
                </div>
            `;
            resultDiv.className = 'mt-4 p-3 rounded-md bg-green-100 text-green-800';
            resultDiv.classList.remove('hidden');
            
            // Clear form
            document.getElementById('question').value = '';
            document.getElementById('answer').value = '';
            
            console.log('Flashcard added:', { studentId, question, answer, subject });
        });
        
        // Get flashcards endpoint
        document.getElementById('get-flashcards').addEventListener('click', function() {
            const studentId = document.getElementById('get_student_id').value.trim();
            const limit = parseInt(document.getElementById('limit').value) || 5;
            const flashcardsContainer = document.getElementById('flashcards-container');
            
            if (!studentId) {
                alert('Please enter a student ID');
                return;
            }
            
            // Filter flashcards by student ID
            const studentFlashcards = flashcardsDB.filter(card => card.student_id === studentId);
            
            if (studentFlashcards.length === 0) {
                flashcardsContainer.innerHTML = `
                    <div class="col-span-full p-6 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800">
                        <p class="text-center">No flashcards found for student ID: ${studentId}</p>
                    </div>
                `;
                return;
            }
            
            // Shuffle and limit
            const shuffled = [...studentFlashcards].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, Math.min(limit, shuffled.length));
            
            // Display flashcards
            flashcardsContainer.innerHTML = '';
            selected.forEach((card, index) => {
                const flashcardElement = document.createElement('div');
                flashcardElement.className = 'flashcard';
                flashcardElement.innerHTML = `
                    <div class="flashcard-inner">
                        <div class="flashcard-front">
                            <span class="subject-badge ${subjectColors[card.subject]}">${card.subject}</span>
                            <p class="text-center font-medium">${card.question}</p>
                        </div>
                        <div class="flashcard-back">
                            <span class="subject-badge ${subjectColors[card.subject]}">${card.subject}</span>
                            <p class="text-center">${card.answer}</p>
                        </div>
                    </div>
                `;
                flashcardElement.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });
                flashcardsContainer.appendChild(flashcardElement);
            });
            
            console.log('Retrieved flashcards:', selected);
        });
        
        // Add some sample flashcards for demonstration
        const sampleFlashcards = [
            {
                student_id: 'stu001',
                question: "What is Newton's Second Law?",
                answer: "Force equals mass times acceleration (F = ma)"
            },
            {
                student_id: 'stu001',
                question: "What is photosynthesis?",
                answer: "A process used by plants to convert light energy into chemical energy"
            },
            {
                student_id: 'stu001',
                question: "What is the Pythagorean theorem?",
                answer: "In a right triangle, the square of the length of the hypotenuse equals the sum of the squares of the other two sides (a² + b² = c²)"
            },
            {
                student_id: 'stu001',
                question: "What is the chemical formula for water?",
                answer: "H₂O (two hydrogen atoms and one oxygen atom)"
            },
            {
                student_id: 'stu001',
                question: "Who wrote 'Romeo and Juliet'?",
                answer: "William Shakespeare"
            },
            {
                student_id: 'stu001',
                question: "What is the capital of France?",
                answer: "Paris"
            },
            {
                student_id: 'stu001',
                question: "What is a binary search algorithm?",
                answer: "A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half"
            }
        ];
        
        // Add sample flashcards to the database
        sampleFlashcards.forEach(card => {
            const subject = classifySubject(card.question, card.answer);
            flashcardsDB.push({
                student_id: card.student_id,
                question: card.question,
                answer: card.answer,
                subject: subject
            });
        });