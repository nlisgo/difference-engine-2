jQuery(document).ready(function($){
	
	var cols = 2;
	var units = 2;
	
	$('#set-engine-submit').button();
	
	check_preset();
	
	$('#style-up').change(function () {
		if ($(this).attr('checked')) {
			$('#build-engine').addClass('style-up');
			$('.column').each(function (index) {
				var tmp = get_val_col(index);
				set_col(index, tmp);
			});
		} else {
			$('#build-engine').removeClass('style-up');
		}
		share_preset();
	});
	
	$('#set-engine').submit(function () {
		cols = parseInt($('#columns', this).val());
		units = parseInt($('#units', this).val());
		
		if ($('#style-up').attr('checked')) {
			$('#build-engine').addClass('style-up');
		} else {
			$('#build-engine').removeClass('style-up');
		}
		
		set_preset(cols, units);
		
		return false;
	});
	
	function share_preset() {
		if ($('.control-form').length==0) {
			return;
		}
		
		var presetstr = '?preset=1&c='+cols+'&u='+units;
		if ($('#style-up').attr('checked')) {
			presetstr += '&s=1';
		}
		if ($('#control-form-half').hasClass('half-cycle')) {
			presetstr += '&h=1';
		}
		
		var colsarr = [];
		
		for (var i=0; i<cols; i++) {
			colsarr[i] = get_val_col(i);
		}
		
		presetstr += '&v='+colsarr.join(',');
		
		var carrys = carry_flags();
		presetstr += '&x='+carrys.join("");
		
		presetstr += '&m='+encodeURIComponent($('.results').val());
		
		var share_url = window.location.protocol + '//' + window.location.host + window.location.pathname + presetstr;
		
		$('#share-engine').html('<p><a href="'+share_url+'" class="share_preset" target="_blank">Share engine</a></p>');
	}
	
	function check_preset() {
		
		// e.g. ?preset=1&s=1&u=15&c=5&v=0,001000000000001,6,6,999999999999&x=11011111111111&h=1&m=Hello World
		
		if (getParameterByName('preset')=='1') {
			c = getParameterByName('c');
			u = getParameterByName('u');
			v = getParameterByName('v');
			
			s = getParameterByName('s');
			x = getParameterByName('x');
			h = getParameterByName('h');
			m = getParameterByName('m');
			
			if (c === false) {
				c = "3";
			}

			if (u === false) {
				u = "5";
			}
			
			if (v === false) {
				v = [];
			} else {
				v = v.split(",");
			}
			
			if (s !== "0") {
				$('#style-up').attr('checked', true);
				$('#build-engine').addClass('style-up');
			} else {
				$('#style-up').attr('checked', false);
				$('#build-engine').removeClass('style-up');
			}
			
			if (x === false) {
				x = "";
			}
			
			if (h !== "1") {
				h = "0";
			}
			
			if (m === false) {
				m = "";
			}
			
			set_preset(c,u,v,x,h,m);
		}
	}
	
	function getParameterByName(name)
	{
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.search);
		if(results == null)
			return false;
		else
			return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	function set_preset(c, u, v, x, h, m) {
		cols = c;
		units = u;
		
		if (m == undefined) {
			m = "";
		} else {
			m = decodeURIComponent(m.toString());
		}
		
		$('#columns').val(c.toString());
		$('#units').val(u.toString());
		
		$('#build-engine').html(build_engine(c, u, x));
		
		$('#control-engine').html(build_controls(c));
		$('#monitor-engine').html('<textarea class="results">'+m+'</textarea>');
		
		$('#control-step-submit').button();
		$('#control-half-submit').button();
		$('#control-cycle-submit').button();
		
		set_controls();
		
		set_dialogs();
		
		if (v != undefined) {
			set_engine(v);
		}
		
		if (h === "1") {
			$('#control-form-half').addClass('half-cycle');
		}
		
		set_carrys();
		share_preset();
		
		$('.results').keyup(function () {
			share_preset();
		});
	}
	
	function set_carrys() {
	
		// toggle carry checkboxes
		$('.carrys h2').button().click(function () {
			var checked = false;
			$('.carrys input').each(function () {
				if (!$(this).attr('checked')) {
					checked = true;
				}
			});
		
			$('.carrys input').attr('checked', checked);
			share_preset();
		});
		
		$('.carrys input').change(function () {
			share_preset();
		});
		
	}
	
	// Set up jQuery UI dialog boxes
	function set_dialogs() {		
		$('.dialog-form').dialog({
			autoOpen: false,
			height: 200,
			width: 350,
			modal: true,
			open: function () {
				$(".dialog-form").unbind('submit');
				$(".dialog-form").submit(function(){
					set_col($('.dialog-col', this).val(), $('.dialog-value', this).val(), $('.dialog-value', this).val(), false, true);
					$(this).dialog("close");
					return false;
				});
			},
			buttons: {
				"Set": function () {
					set_col($('.dialog-col', this).val(), $('.dialog-value', this).val());
					share_preset();
					$(this).dialog("close");
				},
				"Reset": function () {
					var resetval = '';
					for (var i=0; i<units; i++) {
						resetval += '0';
					}
					
					$('.dialog-value', this).val(resetval);
				},
				Cancel: function () {
					$(this).dialog("close");
				}
			}
		});
		
		$('.column h2').button().click(function () {
			var col = $(this).parent('.column').index()-1;
			$('#dialog-col-'+col+' .dialog-value').val(get_val_col(col));
			$('#dialog-col-'+col).dialog("open");
		});		
	}
	
	function carry_flags() {
		var carrys = [0];
		$('.carry').each(function (index) {
			if ($('input', this).attr('checked')) {
				carrys[index+1] = 1;
			} else {
				carrys[index+1] = 0;
			}
		});
		return carrys;
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
	function babbage_add(from, to, carryflags) {
		var len = from.toString().length;
		if (to.toString().length > len) {
			len = to.toString().length;
		}
		var fromstr = lpad(from, len);
		var tostr = lpad(to, len);
		
		if (carryflags == undefined) {
			var carryflags = [];
			for (var i=0; i<len; i++) {
				carryflags[i] = 1;
			}
		}
		
		var fromarr = fromstr.split("");
		var toarr = tostr.split("");
		
		var result = [0];
		var carrys = [0];
		var nocarrys = [0];
		
		for (var i=0; i<len; i++) {
			nocarrys[i+1] = result[i+1] = parseInt(fromarr[i])+parseInt(toarr[i]);
			if (nocarrys[i+1]>=10) {
				nocarrys[i+1] -= 10;
			}
			carrys[i+1] = 0;
		}
		
		for (var i=result.length-1; i>0; i--) {
			if (result[i]>=10) {
				result[i] -= 10;
				if (carryflags[i-1] == 1) {
					result[i-1] += 1;
					carrys[i-1] += 1;
				}
			}
		}
		
		// return value with carries disabled, carries and result if all carries enabled
		return {
			'carryflags': carryflags,
			'nocarrys': nocarrys,
			'carrys': carrys,
			'result': result
		};
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
	
	function animate_col(col, result) {
		var nocarrys = result.nocarrys.join('');
		var result = result.result.join('');
		
		set_col(col, nocarrys, result, true);
	}
	
	function set_engine(colvals) {
		if (!$.isArray(colvals)) {
			colvals = colvals.split(/\r\n|\r|\n/);
		}
		
		tmp = [];
		for (var i=0; i<columns_number(); i++) {
			set_col(i, colvals[i]);
		}
	}
	
	// set the value of a column
	function set_col(col, val, res, output, share) {
		if (val == undefined) {
			val = 0;
		}
		
		if (output == undefined) {
			output = false;
		}
		
		val=val.toString();
			
		if (val[0] == '-') {
			// handle negative numbers
			val=val.substr(1);
			val=val.replace(new RegExp("[^0-9]",'g'),"0");
			var tmp="";
			for (i=val.length-1;i>=0;i--) {
				tmp=(9-val[i])+tmp;
			}
			var tmp1 = babbage_add(lpad(tmp,units,'9'),1);
			var valstr = tmp1.result.join('').substr(1);
		}
		else {
			// handle positive numbers
			val=val.replace(new RegExp("[^0-9]",'g'),"0");
			var valstr = lpad(val, units);
		}
		
		if (res == undefined) {
			var resstr = valstr;
		} else {
			var resstr = lpad(res, units);
		}
		
		if (output && col == 0) {
			output_monitor(resstr);
		}
		
		var valarr = valstr.split("");
		var resarr = resstr.split("");
		var j = 0;
		for (var i=units-1; i>=0; i--) {
			set_dial(col, j, valarr[i], resarr[i]);
			j++;
		}
		
		if (share === true) {
			share_preset();
		}
		
		return false;
	}
	
	function output_monitor(output) {
		output = lpad(output, units);
		
		var lb = "\r\n";
		if ($('#monitor-engine .results').val()=='') {
			lb = "";
		}
		
		$('#monitor-engine .results').append(lb+output);
		$('#monitor-engine .results').scrollTop($('#monitor-engine .results')[0].scrollHeight);
	}
	
	// set the value of an individual dial
	function set_dial(col, unit, val, res) {
		if (isNaN(parseInt(val))) {
			val = 0;
		}
		
		var unit_class = 'from-'+$('#col-'+col.toString()+'-unit-'+unit.toString()).val()+'-to-'+res.toString();
		$('#col-'+col.toString()+'-unit-'+unit.toString()).val(res.toString());
		
		if (val != res) {
			unit_class += ' carry';
			if (unit_class == $('#col-'+col.toString()+'-unit-'+unit.toString()).closest('div').attr('class'))
			{
				unit_class += '1';
			}
		}
		
		$('#col-'+col.toString()+'-unit-'+unit.toString()).closest('div').attr('class', unit_class);
	}
	
	function transfer_col(fromcol, tocol) {
			
		var fromval = get_val_col(fromcol);
		var toval = get_val_col(tocol);
		
		var carryflags = carry_flags();
		
		var result = babbage_add(fromval, toval, carryflags);
			
		animate_col(tocol, result);
		
	}
	
	function columns_number() {
		return cols;
	}

	// Set up jQuery for control form buttons
	function set_controls() {
		$('#control-form-half').submit(function () {
			
			var istart = 0;
			
			if (!$(this).hasClass('half-cycle')) {
				$(this).addClass('half-cycle');
			} else {
				$(this).removeClass('half-cycle');
				istart = 1;
			}	
			
			for (var i=istart; i<columns_number()-1; i+=2) {
				transfer_col(i+1, i);
			}
			
			
			return false;
		});
		
		/*$('#control-form-cycle').submit(function () {
			
			for (var i=0; i<columns_number()-1; i++) {
				transfer_col(i+1, i);
			}
			
			return false;
		});
		
		$('#control-form-step').submit(function () {
			var fromcol = parseInt($('#control-from', this).val());
			var tocol = parseInt($('#control-to', this).val());
			
			transfer_col(fromcol, tocol);
		
			// after result adjust the values of the from and to fields
			var newfromcol = fromcol + 1;
			var newtocol = tocol + 1;
			var coldiff = fromcol - tocol;
		
			if (newfromcol >= columns_number()) {
				newtocol = 0;
				newfromcol = newtocol + coldiff;
			} else if (newtocol >= columns_number()) {
				coldiff = tocol - fromcol;
				newfromcol = 0;
				newtocol = newfromcol + coldiff;
			}		
		
			$('#control-from', this).val(newfromcol.toString());
			$('#control-to', this).val(newtocol.toString());
		
			return false;
		});*/
	}
	
	// build the engine controls
	function build_controls(cols) {
		var cols_default_from = cols - 1;
		
		var controls = '';
		
		controls += '<form class="control-form" id="control-form-half">';
		controls += '<input type="submit" name="control-half-submit" id="control-half-submit" value="Half Cycle" />';
		controls += '</form>';
/*		controls += '<form class="control-form" id="control-form-step">';
		controls += '<label for="control-to">To: </label><input type="number" name="control-to" id="control-to" value="0" min="0" max="'+cols_default_from.toString()+'" />';
		controls += '<label for="control-from">From: </label><input type="number" name="control-from" id="control-from" value="1" min="0" max="'+cols_default_from.toString()+'" />';
		controls += '<input type="submit" name="control-step-submit" id="control-step-submit" value="Single Step" />';
		controls += '</form>';
		
		controls += '<form class="control-form" id="control-form-cycle">';
		controls += '<input type="submit" name="control-cycle-submit" id="control-cycle-submit" value="Single Cycle" />';
		controls += '</form>';*/
		
		return controls;
	}
	
	// build the whole engine
	function build_engine(cols, units, x) {
		var engine = build_carry_switchs(units, x);
		for (var i=0; i<cols; i++) {
			engine += build_col(i, units);
		}
		
		return engine;
	}
	
	// build the carry switchs
	function build_carry_switchs(units, x) {
		var padchr = "1";
		
		if (x == undefined) {
			x = "";
		}
		
		if (x == "0") {
			padchr = x;
		}
		
		x = lpad(x, units-1, padchr);
		
		x = x.replace(new RegExp("[^0-1]",'g'),"1");
		x = x.split("");
		x = x.reverse();
		
		var carrys = '<div class="carrys"><h2>Carrys</h2>';
		for (var i=units-1; i>0; i--) {
			var checkedstr = '';
			if (x[i-1] == '1') {
				checkedstr = ' checked="checked"';
			}
			
			carrys += '<div class="carry carry-unit-'+i.toString()+'"><input type="checkbox" name="carry-'+i.toString()+'" id="carry-'+i.toString()+'" value="1"'+checkedstr+' /></div>';
		}
		carrys += '</div>';
		
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
		var column = '<div class="column" id="'+column_id+'"><h2>Col '+col.toString()+'</h2>';
		column += build_col_dialog(col);
		
		for (var i=units-1; i>=0; i--) {
			column += build_dial(col, i);
		}
		column += '</div>';
		
		return column;
	} 
	
	// build a single dial
	function build_dial(col, unit) {
		var dial_id = 'col-'+col.toString()+'-unit-'+unit.toString();
		var dial = '<div class="dial dial-unit-'+unit.toString()+'"><div><span></span><input type="number" name="'+dial_id+'" id="'+dial_id+'" value="0" min="0" max="9" /></div></div>';
		
		return dial;
	}
	
	// this function could allow the user to use preset settings for examples
	function preset_engine(which) {
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