define(['historyview', 'controlbox', 'd3'], function (HistoryView, ControlBox, d3) {
    var prefix = 'ExplainGit',
        openSandBoxes = [],
        open,
        reset,
        explainGit;

    open = function (args) {
        var name = prefix + args.name,
            containerId = name + '-Container',
            container = d3.select('#' + containerId),
            playground = container.select('.playground-container'),
            scenario = container.select('.scenario'),
            historyView, originView = null,
            controlBox;

        container.style('display', 'block');

        if (jQuery().dialog) {
          $(".ui-dialog-minimized").dialogExtend("restore");
          $(".ui-dialog-content:visible").dialog("close");
          $(scenario).dialog({
            title: "Introduction: " + name,
            width: '500px',
              close: function() {
                  $(this).dialog("destroy");
              }
          })
          .dialogExtend({
            "closable" : false,
            "maximizable" : false,
            "minimizable" : true,
            "collapsable" : false,
            "dblclick" : "minimize",
            "minimizeLocation" : "right"
          });
        }

        args.name = name;
        args.height = 525;
        historyView = new HistoryView(args);

        if (args.originData) {
            originView = new HistoryView({
                name: name + '-Origin',
                width: 300,
                height: 225,
                commitRadius: 15,
                remoteName: 'origin',
                commitData: args.originData
            });

            originView.render(playground);
        }

        controlBox = new ControlBox({
            historyView: historyView,
            originView: originView,
            initialMessage: args.initialMessage
        });

        controlBox.render(playground);
        historyView.render(playground);

        openSandBoxes.push({
            hv: historyView,
            cb: controlBox,
            container: container
        });
    };

    reset = function () {
        for (var i = 0; i < openSandBoxes.length; i++) {
            var osb = openSandBoxes[i];
            osb.hv.destroy();
            osb.cb.destroy();
            osb.container.style('display', 'none');
        }

        openSandBoxes.length = 0;
        d3.selectAll('a.openswitch').classed('selected', false);
    };

    explainGit = {
        HistoryView: HistoryView,
        ControlBox: ControlBox,
        generateId: HistoryView.generateId,
        open: open,
        reset: reset
    };

    window.explainGit = explainGit;

    return explainGit;
});