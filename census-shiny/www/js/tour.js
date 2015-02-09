function takeTour() {
// Define the tour!
var tour = {
  id: "hello-hopscotch",
  onStart: function() {
    console.log('tour started')
  },
  onEnd: function() {
    console.log('tour ended')
  },
  steps: [
//    {
//      title: "Distributed R",
//      content: " HP Vertica Distributed R is an open-source, scalable and high-performance platform for the R language. Designed for data scientists, it accelerates large-scale machine learning, statistical analysis, and graph processing. The secret is in how HP Vertica Distributed R splits tasks between multiple processing nodes to vastly reduce execution time and enables users to analyze much larger data sets. Best of all, HP Vertica Distributed R retains the familiar R look and feel, and data scientists can continue to use their existing statistical packages.",
//      target: document.querySelector("#drlogo"),
//      placement: "right"
//    },
    {
      title: "Census demo",
      content: "The census dataset contains 40 attributes (personal, job and income related) that can be used to predict whether a person earns more than $50K/yr. We use Random Forest to make the predictions and display a bar plot that ranks the attributes in order of importance. Users can select which attribute groups to include in the analysis.",
//This data set contains weighted census data extracted from the 1994 and 1995 Current Population Surveys conducted by the U.S. Census Bureau. The data contains 41 demographic and employment related variables. TODO we classify the features in order of importance ... The attributes are separated into 2 categories: 22 personal attributes and 16 income/job attributes. We removed 3 features because they were related to the questionnaire and not the person itself.",
      target: document.querySelector("#censusdemoheading"),
      placement: "right"
    },
//    {
//      title: "Attributes",
//      content: "The attributes are separated into 2 categories: 22 personal attributes and 16 income/job attributes. We removed 3 features because they were related to the questionnaire and not the person itself.",
//      target: document.querySelector("#attributes"),
//      placement: "right"
//    },
//    {
//      title: "Engine",
//      content: "You can choose if you want to use R or Distributed R. Distributed R is multicore and distributed so it's much faster ",
//      target: document.querySelector("#engine"),
//      placement: "right"
//    },
    {
      title: "Go!",
      content: "Go ahead and click on Rank Attribute Importance! In the backend Distributed R and then vanilla R calculate the importance of the attributes and after a few seconds you'll see a plot with the results.",
      target: document.querySelector("#goButton"),
      placement: "bottom"
    },
    {
      title: "Result",
      content: "This bar plot displays the different attributes ranked by order of importance.",
      target: document.querySelector("#mywell1"),
      placement: "top"
    },
    {
      title: "Speedup",
      content: "Distributed R is considerable faster than regular R performing the same analysis.",
      target: document.querySelector("#speedupbox"),
      placement: "left"
    },
//    {
//      title: "2nd Engine",
//      content: "to get the speed number go ahead and select R as the engine.",
//      target: document.querySelector("#engine"),
//      placement: "right"
//    },
//    {
//      title: "Go!",
//      content: "Click go again!",
//      target: document.querySelector("#goButton"),
//      placement: "right"
//    },
//    {
//      title: "Plot",
//      content: "In this case we're used traditional R to rank the attributes. As you can see the result is the same, only faster with Distributed R.",
//      target: document.querySelector("#mywell1"),
//      placement: "top"
//    },
//    {
//      title: "Differences",
//      content: "If you switch between R and Distributed R you can see that the code differences are minimal.",
//      target: document.querySelector("#differences"),
//      placement: "left"
//    },
//    {
//      title: "Speedup both engines",
//      content: "Now we have the information of the 2 runs and we see that the speedup is great.",
//      target: document.querySelector("#speedupbox"),
//      placement: "left"
//    },
//   {
//      title: "See advantages",
//      content: "Take a look at the advantages!",
//      target: document.querySelector("#myCarousel"),
//      placement: "top"
//    },   
    {
      title: "Performance and scalability",
      content: "The following plots display information about Distributed R's performance and scalability advantage over regular R.",
      target: document.querySelector("#speedupgraphs"),
      placement: "top"
    },
    {
      title: "Learn more",
      content: "You can access the Distributed R code on Github, explore the dataset and learn more in the Distributed R website.",
      target: document.querySelector("#links"),
      placement: "right"
    },




  ]
};

// Start the tour!
hopscotch.startTour(tour);
}
