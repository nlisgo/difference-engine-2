jQuery(document).ready(function($){
	$('#set-engine').submit(function () {
		var cols = parseInt($('#columns', this).val());
		var units = parseInt($('#units', this).val());
		
		var engine = '';
		for (i=0; i<cols; i++) {
			engine += build_col(i, units);
		}
		
		$('#build-engine').html(engine);
		$('#monitor-engine').html('');
		
		return false;
	});
	
	function build_col(col, units) {
		var column_id = 'col-'+col.toString();
		var column = '<column id="'+column_id+'">';
		for (i=0; i<units; i++) {
			column += build_dial(col, i);
		}
		column += '</column>';
		
		return column;
	} 
	
	function build_dial(col, unit, val) {
		if (val == undefined)
		{
			val = 0;
		}
		var dial_id = 'col-'+col.toString()+'-unit-'+unit.toString();
		var dial = '<select name="'+dial_id+'" id="'+dial_id+'">';
		for (i=0; i<10; i++) {
			var selected = '';
			if (i == val) {
				selected = ' selected="selected"';
			}
			dial += '<option'+selected+'>'+i.toString()+'</option>';
		}
		dial += '</select>';
		
		return dial;
	}
});