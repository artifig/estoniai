$(document).ready(function() {
    $('.table').DataTable();

    $('#dashboardLink').click(function(e) {
        e.preventDefault();
        showDashboard();
    });

    $('#assessmentLink').click(function(e) {
        e.preventDefault();
        showAssessment();
    });

    $(window).scroll(function() {
        if($(this).scrollTop() > 50) {
            $('.navbar').addClass('navbar-scrolled');
        } else {
            $('.navbar').removeClass('navbar-scrolled');
        }
    });

    initializeCharts();

    let currentQuestionIndex = 0;
    let totalScore = 0;
    const questions = $("#questionnaire .question");
    const totalQuestions = questions.length;

    // Update total questions display
    $("#totalQuestions").text(totalQuestions);   

    function showDashboard() {
        $('#dashboard').removeClass('hidden');
        $('#database').removeClass('hidden');
        $('#assessment').addClass('hidden');
    }

    function showAssessment() {
        $('#assessment').removeClass('hidden');
        $('#dashboard').addClass('hidden');
        $('#database').addClass('hidden');
    }

    let nameAskingIsComplete = false;

    // Assuming there's a form with an input field for the user's name
    $("#initialForm").submit(function(e) {
        e.preventDefault();
        
        // Get the user's name input value
        const userName = $("#userName").val();
        
        // Check if the user's name is not empty or meets your criteria for completion
        if (userName.trim() !== "") {
            nameAskingIsComplete = true; // Set the flag to true when the name-asking is complete
            startAssessment(); // Start the assessment phase
        } else {
            // Handle the case where the user didn't provide a valid name
        }
    });

 
    function startAssessment() {
        console.log("Starting assessment...");
        
        // Check if the name-asking phase is complete
        if (nameAskingIsComplete) {
            $("#initialForm").addClass('hidden');
            $("#questionnaire").removeClass('hidden');
            $(questions[0]).removeClass('hidden');
            $("#progress").removeClass('hidden');
            $("#currentScore").text("0%"); // Initialize the score display to 0%
            updateProgressBar(); // Now it's safe to call updateProgressBar
        }
    }
    

    $("#questionnaire").on("click", ".option", function() {
        handleOptionSelection($(this));
    });

    function handleOptionSelection(option) {
        const score = parseInt(option.data("score"));
        totalScore += score;

        $(questions[currentQuestionIndex]).addClass('hidden');
        currentQuestionIndex++;

        if (currentQuestionIndex < totalQuestions) {
            $(questions[currentQuestionIndex]).removeClass('hidden');
            updateProgressBar();
        } else {
            finishAssessment();
        }
    }

    function updateProgressBar() {
        const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;
        $("#progressBar").css("width", progressPercentage + "%").attr("aria-valuenow", progressPercentage);
        $("#currentQuestionNumber").text(currentQuestionIndex + 1);
        $("#currentScore").text(calculateScore() + "%");
    }

    function calculateScore() {
        // Check if any questions have been answered to avoid division by zero
        if (currentQuestionIndex > 0) {
            return ((totalScore / (currentQuestionIndex * 4)) * 100).toFixed(2); // Assuming 4 is the max score per option
        } else {
            return 0; // Return a default score of 0% if no questions have been answered
        }
    }    

    function finishAssessment() {
        $("#progress").addClass('hidden');
        $("#questionnaire").addClass('hidden'); // Ensure the questionnaire is hidden
        $("#results").removeClass('hidden');
        $("#score").text(calculateScore() + "%"); // Show final score
        
        // Trigger the information modal with the calculated score
        showInformation(calculateScore());
        console.log("Assessment finished...");
    }

    // Function to display the information modal with content based on the score
    function showInformation(score) {
        console.log("Showing information with score:", score);

        // Set the score in the modal
        console.log("Final score to display in modal:", parseFloat(score).toFixed(2));
        $("#finalScore").text(parseFloat(score).toFixed(2)); // Assuming score is a number and you want to format it to 2 decimal places

        // Determine which actions to propose based on the score
        let actions = [];
        if (score >= 80) {
            actions.push({ 
                title: "Contact AIRE", 
                description: "For pioneering AI integration.", 
                logo: "https://teaduspark.ee/wp-content/uploads/2021/11/AIRE_logo_black_background.png"
            });
        }
        if (score >= 60 && score < 80) {
            actions.push({ 
                title: "Contact Tartu Science Park", 
                description: "For AI research and collaboration opportunities.", 
                logo: "https://teaduspark.ee/wp-content/uploads/2023/09/SPARKUP-2.png"
            });
        }
        if (score >= 40 && score < 60) {
            actions.push({ 
                title: "Contact Science Park Tehnopol", 
                description: "For startup support and innovation.", 
                logo: "https://www.tehnopol.ee/wp-content/uploads/2021/01/Tehnopol_logo_RGB.png"
            });
        }
        if (score < 40) {
            actions.push({ 
                title: "Contact Innovate Estonia", 
                description: "For digitalisation and business services.", 
                logo: "https://brand.estonia.ee/wp-content/uploads/2020/11/EAS_RGB_White.jpg"
            });
        }
    
        const modal = $("#information");
        const modalBody = modal.find(".modal-body");
    
        modalBody.empty(); // Clear previous content

        console.log("Cleared modal body");
    
        actions.forEach((action) => {
            const actionBox = $("<div>").addClass("action-box");
            const box = $("<div>").addClass("box");
            const img = $("<img>").attr("src", action.logo).addClass("logo-class"); // Create an <img> element and set its src
            const title = $("<h4>").text(action.title);
            const description = $("<p>").text(action.description);
            modalBody.append($("<h4>").text(`AI Readiness Score: ${parseFloat(score).toFixed(2)}%`));
            modalBody.append($("<p>").text(`Review the recommended actions below based on your score.`));
            box.append(img, title, description); // Append the img element here
            actionBox.append(box);
            modalBody.append(actionBox);
        });        
        
        modal.modal("show");
        console.log("Modal displayed");
    }
    

    // Call this function when the questionnaire finishes (e.g., in your finishAssessment() function)
    function onQuestionnaireFinish(score) {
        // Display the information modal with proposed actions based on the score
        showInformation(score);
    }

    function initializeCharts() {
        // Chart initialization functions
        createTotalCompaniesChart();
        createAverageScoreChart();
        createAdoptionRateChart();
        createImpactScoreChart();
    }

    // Define chart creation functions here
    // For example, createTotalCompaniesChart(), createAverageScoreChart(), etc.
        // Total Companies chart
        function createTotalCompaniesChart() {
            var totalCompaniesData = {
                labels: ["Beginner", "Intermediate", "Advanced"],
                datasets: [{
                    data: [100, 73, 31],
                    backgroundColor: ["#007bff", "#28a745", "#dc3545"],
                }]
            };
    
            new Chart(document.getElementById("totalCompaniesChart"), {
                type: 'bar',
                data: totalCompaniesData,
                options: {
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
    
        // Average AI Readiness Score chart
        function createAverageScoreChart() {
            var averageScoreData = {
                labels: ["Beginner", "Intermediate", "Advanced"],
                datasets: [{
                    data: [75, 15, 10],
                    backgroundColor: ["#007bff", "#28a745", "#dc3545"],
                }]
            };
    
            new Chart(document.getElementById("averageScoreChart"), {
                type: 'doughnut',
                data: averageScoreData,
                options: { legend: { display: false } }
            });
        }
    
        // AI Adoption Rate chart
        function createAdoptionRateChart() {
            var adoptionRateData = {
                labels: ["Beginner", "Intermediate", "Advanced"],
                datasets: [{
                    data: [40, 30, 30],
                    backgroundColor: ["#007bff", "#28a745", "#dc3545"],
                }]
            };
    
            new Chart(document.getElementById("adoptionRateChart"), {
                type: 'pie',
                data: adoptionRateData,
                options: { legend: { display: false } }
            });
        }
    
        // AI Impact Score chart
        function createImpactScoreChart() {
            var impactScoreData = {
                labels: ["Innovation", "Cost Reduction", "Customer Experience", "Revenue Growth", "Efficiency"],
                datasets: [{
                    data: [5, 7, 9, 7.5, 8.2],
                    borderColor: "#007bff",
                    borderWidth: 2,
                    fill: true,
                    backgroundColor: "rgba(0, 123, 255, 0.2)",
                    pointBackgroundColor: "#007bff",
                    pointRadius: 4,
                    pointBorderWidth: 2,
                    pointBorderColor: "#fff",
                    label: 'Impact on Business' // Set a label for the dataset
                }]
            };

            new Chart(document.getElementById("impactScoreChart"), {
                type: 'radar',
                data: impactScoreData,
                options: {
                    scale: {
                        angleLines: { display: false },
                        ticks: { beginAtZero: true, max: 10, stepSize: 1 }
                    },
                    plugins: {
                        legend: {
                            display: true, // Display the legend
                            position: 'top', // Adjust the position of the legend if needed
                        }
                    }
                }
            });
        }

});
