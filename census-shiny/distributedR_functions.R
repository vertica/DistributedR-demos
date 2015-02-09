library(distributedR)
library(HPdclassifier)
library(logging)

loadData <- function(nrow = 10000)
{
	continuous = c(0,5,16,17,18,29,38)+1
	nominal = 1:41
	nominal = nominal[!(nominal %in% continuous)]
	data = read.table("dataset/census-income.data",sep=",",nrows = nrow)
	features = scan("dataset/census-income.features",
		 sep = "\n",what = character())

	data = data[,-25]
	data[,nominal] = lapply(data[,nominal], factor)
	data[,nominal] = lapply(data[,nominal], as.numeric)

	response = data[1:nrow,41]
	response = as.factor(response)
	colnames(data) <- features
	data = data[1:nrow,]
	return(list(data=data,response=response))
}

runModel <- function(data, response, use.personal_attributes=TRUE,
	 use.jobincome_attributes=TRUE,
	 use.DR=FALSE)
{

  logdebug("use.personal-attributes: %s use.income-and-job-attributes: %s use.distributed-r:%s", use.personal_attributes,use.jobincome_attributes,use.DR)
	personal_attributes = c(1,5,7,8,11,12,13,20,21,22,23,24,25,26,27,28,29,31,32,33,34,35)
	job_attributes = c(2,3,4,9,10,14,30,36)
	income_attributes = c(6,15,16,17,18,19,38,39)
	chosen_features = NULL
	if(use.personal_attributes)
		chosen_features = c(chosen_features,personal_attributes)
	if(use.jobincome_attributes) {
		chosen_features = c(chosen_features,job_attributes)
		chosen_features = c(chosen_features,income_attributes)
        }

  if (length(chosen_features) == 0) {
      logdebug("chosen_features is 0")
      return(NULL)
  }
	data = data[,chosen_features]
	if(use.DR) {
      loginfo("processing data using Distributed R, %d rows, %d cols", nrow(data), ncol(data))
	    model = hpdrandomForest(data, response, nExecutor = 3)
  }
	else {
      loginfo("processing data using regular R, %d rows, %d cols", nrow(data), ncol(data))
	    model = randomForest(data, response)
  }
	#createBarPlot(model)
	return(model)
}



createBarPlot <- function(model)
{
  num_features = nrow(model$importance)
  importance_values = as.vector(model$importance)
  importance_features = rownames(model$importance)
  reorder = order(importance_values,decreasing=TRUE)
  importance_features = importance_features[reorder]
  importance_values = importance_values[reorder]

  centers = barplot(importance_values,main="Mean Decrease in Gini")
  widthoffeatures <- function(string)
  {
    strwidth(string,cex = .8,units = "user")/.8
  }
  #offset = sapply(importance_features,widthoffeatures)
	offset <- rep(0, length(importance_features))
  text(centers-.5,offset ,importance_features,
       pos=1,srt = 90,xpd = TRUE, cex = 1)

}
