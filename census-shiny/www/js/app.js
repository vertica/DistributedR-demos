(function() {
  /*SpeedupCalculator class*/
  var SpeedupCalculator = function () {
    this.rTime = null;
    this.distributedRTime = null;

    SpeedupCalculator.prototype.calculateSpeedup = function() {
      if(this.rTime != null && this.distributedRTime != null) {
        var speedup = this.rTime / this.distributedRTime;
        console.log("calculateSpeedup(): rTime: %f distributedRTime: %f speedup: %f",
        this.rTime, this.distributedRTime, speedup);
        return speedup;
      }
      else {
        console.log("calculateSpeedup(): rTime: %f distributedRTime: %f speedup: cannot calculate",
        this.rTime, this.distributedRTime);
        return null;
      }
    }
  }
  /* ======= Model ======= */
  var model = {
    /*Used to keep track of which checkboxes where checked in the last calculation.
    Updated when user clicks the goButton*/
    personalChecked: true,
    jobincomeChecked: true,
    /*array of pairs {engine, time}. E.g. {distributedR, 3secs}. After every run a new pair is added.*/
    runs: [],
    /*keeps track of timing information to perform speedup calculation between R and Distributed R.
    Positions in the array are indexed as follows:
    Personal | Jobincome | Index
    ---------|-----------|------
    0          0           0
    0          1           1
    1          0           2
    1          1           3
    */
    timings: [],
    init: function() {
      for (i = 0; i < 4; i++) {
        this.timings.push(new SpeedupCalculator());
      }
    }
  }

  /* ======= Octopus ======= */
  var octopus = {
    init: function() {
      console.log('Initializing octopus...');
      model.init();
      // tell our views to initialize
      historyView.init();
      speedupView.init();
      timingView.init();
    },

    getpersonalChecked: function() {
      return model.personalChecked;
    },
    getjobincomeChecked: function() {
      return model.jobincomeChecked;
    },
    setpersonalChecked: function(personalChecked) {
      model.personalChecked = personalChecked;
    },
    setjobincomeChecked: function(jobincomeChecked) {
      model.jobincomeChecked = jobincomeChecked;
    },
    getTimings: function() {
      return model.timings;
    },
    getRuns: function() {
      return model.runs;
    },

    /*functions*/
    calculateTimingsIndex: function(personalChecked, jobincomeChecked){
      return personalChecked + (jobincomeChecked * 2);
    },
    /*Uses a regex to extract timing information. E.g.: 3.03 sec(s)*/
    matchTimingInfo: function(text) {
      var re = /\d+.\d+/
      var m = re.exec(text);
      if (m == null) {
        console.log("Text: %s produced no match", text);
        return null;
      } else {
        var s = ''
        for (i = 0; i < m.length; i++) {
          s = s + m[i] + "\n";
        }
        var value = parseFloat(s);
        console.log('Text %s produced match: %s secs: %f', text, s, value);
        return value;
      }
    },

    /*called when an R run is completed*/
    onRRunCompleted: function(rTime) {
      var index = this.calculateTimingsIndex(model.personalChecked, model.jobincomeChecked);
      model.timings[index].rTime = rTime;
      speedupView.render();
      historyView.addRun('R', rTime);
      timingView.clearRTiming();
    },
    /*called when a Distributed R run is completed*/
    onDistributedRRunCompleted: function(distributedRTime) {
      var index = this.calculateTimingsIndex(model.personalChecked, model.jobincomeChecked);
      model.timings[index].distributedRTime = distributedRTime;
      speedupView.render();
      historyView.addRun('Distributed R', distributedRTime);
      timingView.clearDistributedRTiming();
    }
  }


  /* ======= View ======= */

  var speedupView = {
    init: function() {
      console.log('initializing speedup view');
      // store pointers to our DOM elements for easy access later
      this.speedupNumberDiv = document.getElementById('speedup-number');
      this.speedupInfoDiv = document.getElementById('speedup-info');
      this.goButton = document.getElementById('goButton');
      this.personalChecked =  document.getElementById('attributes1').checked;
      this.jobincomeChecked =  document.getElementById('attributes2').checked;

      // events
      var goButtonObj = {
        handleEvent: function() {
          /*valiate that at least one checkbox is checked*/
          var checkedAtLeastOne = false;
          $('input[type="checkbox"]').each(function() {
            if ($(this).is(":checked")) {
              checkedAtLeastOne = true;
            }
          });
          if(checkedAtLeastOne == false) {
            //$.la ('Please, check at least one attribute.', '');
            //$('#myalert').show();
            var alert = '<div id="myalert" class="sticky alert alert-danger alert-dismissible fade in" role="alert"> \
<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
<strong>Please, check at least one attribute group!</strong> \
            </div>'
            if ($('#myalert').length == 0) {
              $('#maincontainer').prepend(alert);
            }

          }
          else {
            $('#myalert').remove();
          }
          /*shiny names "personal attributes" checkbox "attributes1" and
          "jobincome attributes" checkbox "attributes2"*/
          octopus.setpersonalChecked(document.getElementById('attributes1').checked);
          octopus.setjobincomeChecked(document.getElementById('attributes2').checked);
          console.log('goButton clicked: personalChecked: %d, jobincomeChecked: %d',
          octopus.getpersonalChecked(), octopus.getjobincomeChecked());
          if(checkedAtLeastOne) {
            //hide image
            $("#shinyBarPlot").hide();
            $("#serverspecs").hide();
            //show progress bar
            $("#progressbar").show();

            $('html, body').animate({
              scrollTop: $("#censusdemo").offset().top
            }, 1000);
          }
        }
      };

      this.goButton.addEventListener('click', goButtonObj);

      // render this view (update the DOM elements with the right values)
      this.render();
    },

    render: function() {
      var index = octopus.calculateTimingsIndex(octopus.getpersonalChecked(), octopus.getjobincomeChecked());
      var timings = octopus.getTimings();
      var speedupCalculator = timings[index];
      var speedup = speedupCalculator.calculateSpeedup();
      var rTime = speedupCalculator.rTime;
      var distributedRTime = speedupCalculator.distributedRTime;
      // update the DOM elements
      if (distributedRTime == null && rTime == null) {
        this.speedupInfoDiv.innerHTML = "To display speedup information select attributes and click Calculate Importance.";
        this.speedupNumberDiv.innerHTML = "";
      }
      else if(distributedRTime != null && rTime != null) {
        this.speedupInfoDiv.innerHTML = 'Distributed R speedup over regular R.<br/>Using 3 cores.';
        this.speedupNumberDiv.innerHTML = speedup.toFixed(2) + "X";
      }
      else if(distributedRTime == null && rTime != null) {
        this.speedupInfoDiv.innerHTML = "Got R timing information. Now need to run Distributed R to display speedup information." + "<br>" + "Choose Distributed R and click on Calculate Importance";
        this.speedupNumberDiv.innerHTML = "";
      }
      else if(distributedRTime != null && rTime == null) {
        this.speedupInfoDiv.innerHTML = "Got Distributed R timing information. Now need to run regular R to display speedup information."  + "<br>" + "Choose R and click on Calculate Importance";;
        this.speedupNumberDiv.innerHTML = "";
      }
      console.log('speedupView rendered: info: %s number: %s', this.speedupInfoDiv.innerHTML, this.speedupNumberDiv.innerHTML);
    }
  }
  var timingView = {
    init: function() {
      console.log('initializing timings view');
      this.rTimingDiv = document.getElementById('shinyElapsedRTime');
      this.distributedRTimingDiv = document.getElementById('shinyElapsedDistributedRTime');
    },
    clearRTiming: function() {
      this.rTimingDiv.innerHTML = '';
    },
    clearDistributedRTiming: function() {
      this.distributedRTimingDiv.innerHTML = '';
    }
  }



  var historyView = {
    init: function() {
      console.log('initializing history view');

      //hide busy div
      $('div.busy').hide();

      // store the DOM element for easy access later
      this.historyTextbox = document.getElementById('content');
      /*R timing info is output in 'similarHouse1' by shiny
      Distributed R info is output in 'shinyElapsedRTime'*/
      this.rTimingInfo = document.getElementById('similarHouse1');
      this.distributedRTimingInfo = document.getElementById('shinyElapsedRTime');

      // configuration of the observers:
      var config = { attributes: false, childList: true, characterData: true, subtree: true };

      /*
      register observer that's triggered when shiny outputs new R timing info
      */
      var onRTimingInfoUpdated = function(mutation) {
        console.log('onRTimingInfoUpdated: mutation, type: %s attributeName: %s oldValue: %s',
        mutation.type, mutation.attributeName, mutation.oldValue);
        var rTime = octopus.matchTimingInfo(document.getElementById('shinyElapsedRTime').innerHTML);
        if (rTime != null) {
          octopus.onRRunCompleted(rTime);
        }
      }
      var rObserver = new MutationObserver(function(mutations) {
        mutations.forEach(onRTimingInfoUpdated);
      });
      var rTarget = document.querySelector('#shinyElapsedRTimeDiv');
      rObserver.observe(rTarget, config);

      /*
      register observer that's triggered when shiny outputs new Distributed R timing info
      */
      var onDistributedRTimingInfoUpdated = function(mutation) {
        console.log('onDistributedRTimingInfoUpdated: mutation, type: %s attributeName: %s oldValue: %s',
        mutation.type, mutation.attributeName, mutation.oldValue);
        var distributedRTime = octopus.matchTimingInfo(document.getElementById('shinyElapsedDistributedRTime').innerHTML);
        if (distributedRTime != null) {
          octopus.onDistributedRRunCompleted(distributedRTime);
        }
      }
      var distributedRObserver = new MutationObserver(function(mutations) {
        mutations.forEach(onDistributedRTimingInfoUpdated);
      });
      var distributedRTarget = document.querySelector('#shinyElapsedDistributedRTimeDiv');
      distributedRObserver.observe(distributedRTarget, config);

      //detect when shiny progress bar is active
      var shinyProgressConfig = { attributes: false, childList: true, characterData: false, subtree: false };
      var onShinyProgressUpdated = function(mutation) {
        //      console.log("change in shiny progress bar");
        for (var i = 0; i < mutation.addedNodes.length; ++i) {
          if(mutation.addedNodes[i].className == 'shiny-progress-container') {
            console.log('shiny progress bar added');
            //$('div.busy').show();
          }
          //console.log('added node %s', mutation.addedNodes[i]);
        }
        for (var i = 0; i < mutation.removedNodes.length; ++i) {
          if(mutation.removedNodes[i].className == 'shiny-progress-container') {
            console.log('shiny progress bar removed');
            //remove busy div
            $('#progressbar').hide();
            $('#shinyBarPlot').show();
            $("#serverspecs").show();
            var state = hopscotch.getState();
            var tour = hopscotch.getCurrTour();
            if(tour) {
              hopscotch.showStep(2);
            }
          }
          //console.log('removed node %s', mutation.removedNodes[i]);
        }

      }
      var shinyProgressObserver = new MutationObserver(function(mutations) {
        mutations.forEach(onShinyProgressUpdated);
      });
      var shinyProgressTarget = document.body;
      shinyProgressObserver.observe(shinyProgressTarget, shinyProgressConfig);


      // render this view (update the DOM elements with the right values)
      this.render();
    },

    render: function() {

    },
    addRun: function(engine, time) {
      var color = '';
      var message = " calculations took: " + time + " msec(s)";
      if(engine == 'Distributed R') {
        color = "blue";
      }
      else if(engine == 'R') {
        color = "red";
      }
      console.log('adding new message to history: color: %s engine: %s message: %s', color, engine, message);
      $('#content').prepend('<p><span style="color:' + color + '">' + engine + '</span>' +
      ': ' + message + '</p>');
    }
  }
  /*configure notifications*/
  // $.laConfig ({
  //   classes : {
  //     box: 'lite-alert-box',
  //     item: 'lite-alert-item',
  //     close: 'lite-alert-item-close',
  //     header: 'lite-alert-item-header',
  //     content: 'lite-alert-item-content',
  //     footer: 'lite-alert-item-footer'
  //   },
  //   speed: 200
  // });

  // make it go!
  octopus.init();
})();
