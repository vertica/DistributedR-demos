## Introduction
In this demo we analyze the  [Census Dataset](https://archive.ics.uci.edu/ml/datasets/Census+Income "Census dataset") using advanced machine learning algorithms included in the [Distributed R](https://github.com/vertica/DistributedR "Distributed R Github repo") package. We use RStudio's [Shiny](https://github.com/rstudio/shiny "Shiny Giithub repo") to serve the demo over the web.

[//]: # ([](https://github.com/vertica/DistributedR-demos/census-shiny/blob/master/www/img/dr-shiny-demo.png))


### Distributed R
You can access Distributed R source code [here](https://github.com/vertica/DistributedR "Distributed R Github repo").
Some of the Distributed R advantages are:
+ **Analyze data too large for R.** R struggles to handle large datasets such as those that are even just hundreds of gigabytes in size or that contain billions of rows. Distributed R allows the analysis of hundreds of GBs or even TBs of data.
+ **Distributed processing, vastly improved performance.**
Distributed R splits tasks between multiple processing nodes to vastly reduce execution time and enables the analysis of much larger datasets.
+ **Use familiar GUIs and packages.** Distributed R retains the familiar R look and feel, and data scientists can continue to use their existing statistical packages and tools like RStudio.
+ **Open-source**. Distributed R is fully open-source. HP Vertica provides enterprise support if you need it.

### Dataset and algorithms
The census dataset contains 40 attributes (personal, job and income related) that can be used to predict whether a person earns more than $50K/yr. We use Random Forest to make the predictions and display a bar plot that ranks the attributes in order of importance. Users can select which attribute groups to include in the analysis.

## Installing the demo

#### Prerequisites
+  R
+  Latest shiny version from Github
+  Distributed R
+  Logging package

#### Shiny

    if (!require("devtools"))
      install.packages("devtools")
    devtools::install_github("rstudio/shiny")  


####  Distributed R

There are two ways to Install Distributed R.
Using the Distributed R installer (recommended):

1.  Go to [http://my.vertica.com/distributedr](http://my.vertica.com/distributedr).
2.  Sign up/Sign in and download the Distributed R installer (Downloads -> HP Vertica Distributed R).
3.  Follow the installation instructions in the  [docs](http://www.vertica.com/hp-vertica-documentation/hp-vertica-distributed-r-1-0-x-product-documentation/ "Distributed R docs") .
4.  In Distributed R 1.0.0 we only support Cent0S. Ubuntu will be supported in release 1.1.0.

Building from source:

1.  Go to [http://github.com/vertica/distributedr](http://github.com/vertica/distributedr) and follow the instructions.

#### Logging

      install.packages('logging')

#### Dataset
The dataset is compressed to save space. To unpack the dataset run:

    gunzip -c census-income.data.gz > census-income.data

## Running the demo
To start the demo:

    R> library(shiny); library(distributedR);
    R> runApp('.')

If Distributed R was already running you need to stop it first:

    R> distributedR_shutdown(); runApp('.')

You can pass additional options to Shiny:

    R> distributedR_shutdown(); runApp('.', host='0.0.0.0', port=8765, launch.browser=FALSE) 

## Feedback
Report any issues and suggestions [here](https://github.com/vertica/DistributedR-demos/issues).
