(function($) {

    $(document).on('ready', function() {
        $('form#rc-compound-interest-calculator-frm').validate();
	});

	var main_color = '#000000';
	var secondary_color = '#000000';
	var border_color = '#000000';
	var point_background_color = '#000000';
	var point_border_color = '#000000';
	if (rc_calculator_local_vars.chart_main_color !== undefined) {
		main_color = rc_calculator_local_vars.chart_main_color;
	}
	if (rc_calculator_local_vars.chart_secondary_color !== undefined) {
		secondary_color = rc_calculator_local_vars.chart_secondary_color;
	}
	if (rc_calculator_local_vars.chart_border_color !== undefined) {
		border_color = rc_calculator_local_vars.chart_border_color;
	}
	if (rc_calculator_local_vars.chart_point_background_color !== undefined) {
		point_background_color = rc_calculator_local_vars.chart_point_background_color;
	}
	if (rc_calculator_local_vars.chart_point_border_color !== undefined) {
		point_border_color = rc_calculator_local_vars.chart_point_border_color;
	}

    $(document).on('click','form#rc-compound-interest-calculator-frm button',function(e){
        e.preventDefault();

        if ($('form#rc-compound-interest-calculator-frm').valid()) {
			$('.rc-loader').css('display','flex');
			$('form#rc-compound-interest-calculator-frm button').hide();

            data = {
                'action' : 'rc_calculate',
                'nonce'  : $('#_wpnonce').val(),
                'months' : $('input[name="rc-number-of-months"]').val(),
                'balance' : $('input[name="rc-start-balance"]').val(),
                'percent' : $('input[name="rc-percent-per-month"]').val()
			};

            $.post(rc_calculator_local_vars.ajax_url, data, function(response) {
                if (response.success) {

                    var rc_calculator_canvas = document.getElementById("rc-results-chart");
					var ctx = rc_calculator_canvas.getContext("2d");

					//Gradient Background Color
					var gradient = ctx.createLinearGradient(100, 0, rc_calculator_canvas.width - 100, 0);
					gradient.addColorStop(0, main_color);
					gradient.addColorStop(1, secondary_color);

                    let rc_chart_data = {
                        labels: response.data.chart_labels,
                        datasets: [
							{
								label: 'Compound Interest',
								data: response.data.chart_data,
								borderColor: border_color,
								backgroundColor: gradient,
								pointBackgroundColor: point_background_color,
								pointBorderColor: point_border_color
							}
						]
                    };

                    let rc_chart_options = {
						responsive: true,
						legend: false,
						tooltips: {
							"enabled": true
						},
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero: true,
								},
								gridLines: {
									display: true,
									color: '#e9e9e9',
									lineWidth: 1
								}
							}],
							xAxes: [{
								ticks: {
									beginAtZero: true,
									display: true,
									autoSkip: true,
									maxTicksLimit: 12
								},
								gridLines: {
									display: true,
									color: '#e9e9e9',
									lineWidth: 1
								}
							}]
						}
					};

					let rc_line_chart = new Chart(rc_calculator_canvas, {
						type: 'line',
						data: rc_chart_data,
						options: rc_chart_options,
					});

                    $('#rc-results-table-container').html(response.data.table);
                    $('#rc-results-table').dataTable({
                        searching: false,
                        ordering:  false,
                        lengthChange: false,
						info: false,
						pageLength: 12,
						"fnDrawCallback": function ( oSettings ){
							if(oSettings.fnRecordsTotal() < 13){
								$('.dataTables_length').hide();
								$('.dataTables_paginate').hide();
							} else {
								$('.dataTables_length').show();
								$('.dataTables_paginate').show();
							}
						}
					});
					$('#rc-results-chart-container img').hide();
					$('#rc-results-chart, #rc-results-table-container').show();

					$('.rc-loader').hide();
					$('form#rc-compound-interest-calculator-frm button').show();
                } else {
                    $('#rc-compound-interest-calculator-frm-messages').html('An error occured. Please try again.');
                }
            });
        }
    });
})(jQuery);
