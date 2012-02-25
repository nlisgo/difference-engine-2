jQuery(document).ready(function($){
	
	var cols = 2;
	var units = 2;
	
	$('#set-engine-submit').button();
	
	$('#set-engine').submit(function () {
		cols = parseInt($('#columns', this).val());
		units = parseInt($('#units', this).val());
		
		$('#build-engine').html(build_engine(cols, units));
		$('#monitor-engine').html('');
		
		set_dialogs();
		
		// toggle carry checkboxes
		$('carrys h2').button().click(function () {
			var checked = false;
			$('carrys input').each(function () {
				if (!$(this).attr('checked')) {
					checked = true;
				}
			});
			
			$('carrys input').attr('checked', checked);
		});
		
		return false;
	});
	
	// Set up jQuery UI dialog boxes
	function set_dialogs() {		
		$('.dialog-form').dialog({
			autoOpen: false,
			height: 300,
			width: 350,
			modal: true,
			buttons: {
				"Set": function () {
					set_col($('.dialog-col', this).val(), $('.dialog-value', this).val());
					$(this).dialog("close");
				},
				"Reset": function () {
					set_col($('.dialog-col', this).val());
					$(this).dialog("close");
				},
				Cancel: function () {
					$(this).dialog("close");
				}
			}
		});
		
		$('column h2').button().click(function () {
			var col = $(this).parent('column').index()-1;
			$('#dialog-col-'+col+' .dialog-value').val(get_val_col(col));
			$('#dialog-col-'+col).dialog("open");
		});		
	}
	
	// get value of column as a string
	function get_val_col(col) {
		var val = '';
		$('#col-'+col.toString()+' input').each(function () {
			val += $(this).val();
		});
		
		return val;
	}
	
	// adds values together one cog at a time. If a value > 9 then this will need to trigger a carry
	// this is adding one unit at a time so this makes it easy to add together larger integers
	function babbage_add(from, to) {
		var len = from.toString().length;
		if (to.toString().length > len) {
			len = to.toString().length;
		}
		var fromstr = lpad(from, len);
		var tostr = lpad(to, len);
		
		var fromarr = fromstr.split("");
		var toarr = tostr.split("");
		
		var result = [];
		
		for (var i=0; i<len; i++) {
			result[i] = parseInt(fromarr[i])+parseInt(toarr[i]);
		}
		
		return result;
	}
	
	// create string with padded characterd to the left of the string
	function lpad(val, padlen, padchar) {
		padstr = val.toString();
		
		if (padlen < val.toString().length) {
			padstr = padstr.substr(val.toString().length-padlen);
		} else {
			if (padchar == undefined) {
				padchar = "0";
			}

			for (var i=val.toString().length+1; i<=padlen; i++) {
				padstr=padchar+padstr;
			}
		}
		
		return padstr;
	}
	
	// set the value of a column
	function set_col(col, val) {
		if (val == undefined) {
			val = 0;
		}
		
		var valstr = lpad(val, units);
		var valarr = valstr.split("");
		var j = 0;
		for (var i=units-1; i>=0; i--) {
			set_dial(col, j, valarr[i]);
			//$('#col-'+col.toString()+'-unit-'+j.toString()).val(valarr[i]);
			j++;
		}
		
		return false;
	}
	
	// set the value of an individual dial
	function set_dial(col, unit, val) {
		if (isNaN(parseInt(val))) {
			val = 0;
		}
		$('#col-'+col.toString()+'-unit-'+unit.toString()).val(val.toString());
	}
	
	// build the whole engine
	function build_engine(cols, units) {
		var engine = build_carry_switchs(units);
		for (var i=0; i<cols; i++) {
			engine += build_col(i, units);
		}
		
		return engine;
	}
	
	// build the carry switchs
	function build_carry_switchs(units) {
		var carrys = '<carrys><h2>Carrys</h2>';
		for (var i=units-1; i>0; i--) {
			carrys += '<carry class="carry-unit-'+i.toString()+'"><input type="checkbox" name="carry-'+i.toString()+'" id="carry-'+i.toString()+'" value="1" checked="checked" /></carry>';
		}
		carrys += '</carrys>';
		
		return carrys;
	}
	
	function build_col_dialog(col) {
		var dialog = '<form class="dialog-form" id="dialog-col-'+col.toString()+'" title="Set column value">';
		dialog += '<input type="hidden" name="dialog-col" class="dialog-col" value="'+col.toString()+'" />';
		dialog += '<input type="text" class="dialog-value" name="dialog-value" value="0" />';
		dialog += '</form>';
		
		return dialog;
	}
	
	// build a column
	function build_col(col, units) {
		var column_id = 'col-'+col.toString();
		var column = '<column id="'+column_id+'"><h2>Col '+col.toString()+'</h2>';
		column += build_col_dialog(col);
		
		for (var i=units-1; i>=0; i--) {
			column += build_dial(col, i);
		}
		column += '</column>';
		
		return column;
	} 
	
	// build a single dial
	function build_dial(col, unit) {
		var dial_id = 'col-'+col.toString()+'-unit-'+unit.toString();
		var dial = '<dial class="dial-unit-'+unit.toString()+'"><input type="number" name="'+dial_id+'" id="'+dial_id+'" value="0" min="0" max="9" /></dial>';
		
		return dial;
	}
	
	// this function could allow the user to use preset settings for examples
	function preset(which) {
		switch (which) {
			case 'xsquare':
			case 'xsquared':
			case 'x^2':
				break;
			
		}
	}
	
	function debug(val) {
		console.log(val);
	}
});