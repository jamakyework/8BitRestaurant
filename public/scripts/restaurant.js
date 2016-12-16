$(document).ready(function(){
console.log('sourced');
init();
}); //end document ready

function init(){
$('#addEmp').on('click', createEmployee);
$('#addDable').on('click', createTable);
listEmployees();
}

// arrays
var tables=[];
var employees=[];

var createEmployee = function(){
  console.log( 'in createEmployee' );
  // get user input
  var employeeFirstName = document.getElementById( 'employeeFirstNameIn' ).value;
  var employeeLastName = document.getElementById( 'employeeLastNameIn' ).value;
  // create object for employee
  var newEmployee= {
    firstName : employeeFirstName,
    lastName : employeeLastName,
    duty: true
  }; // end object
  // push into employees array
  employees.push( newEmployee );

  $.ajax({
    type: 'POST',
    url: 'addEmployee',
    data: newEmployee,
    success: function(response){
      console.log("Recieved: ", response);
      listEmployees();

    }//end success
  });// end ajax
  // update display

}; // end createEmployee

var listEmployees = function(){
  $.ajax({
    type: 'GET',
    url: '/allEmp',
    success: function(response){
      console.log('Get All Employees', response);

      document.getElementById('employeesOutput').innerHTML = '<ul>';
      // loop through the tables array and display each table
      for( i=0; i< response.length; i++ ){
        var line = response[i].first_name + " " + response[i].last_name + ', id: ' + response[i].id;
        // add line to output div
        document.getElementById('employeesOutput').innerHTML += '<li>' + line + '</li>';
      }
      document.getElementById('employeesOutput').innerHTML += '</ul>';
      listTables();
    }
  });//end GET ajax
}; // end listEmployees

var createTable = function(){
  console.log( 'in createTable' );
  // get user input
  var tableName = document.getElementById('nameIn').value;
  var tableCapacity = document.getElementById('capacityIn').value;
  // table object for new table
  var newTable = {
    'name': tableName,
    'capacity': tableCapacity,
    'status': 'empty'
  };
  // push new obejct into tables array
  tables.push( newTable );

  $.ajax({
    type: 'POST',
    url: '/addDtable',
    data: newTable,
    succes: function(response){
      console.log('Received: ', response);
    }// end sucess
  });// end ajax
  console.log( 'added table: ' + newTable.name );
  // update output
  listTables();
}; // end createTable

var cycleStatus = function( index ){
  console.log( 'in cycleStatus: ' + index );
  // move table status to next status
  switch( tables[index].status ){
    case  'empty':
        tables[index].status = 'seated';
        break;
    case  'seated':
        tables[index].status = 'served';
        break;
    case  'served':
        tables[index].status = 'dirty';
        break;
    case  'dirty':
        break;
    default:
      tables[index].status = 'empty';
  }
  // show tables on DOM
  listTables();
}; // end cycleStatus



var listTables = function(){
  console.log( "in listTables" );
  $.ajax({
    type: 'GET',
    url: '/allTable',
    success: function(Tresponse){
      console.log('Get All DTables', Tresponse);
      // show tables on DOM
      $.ajax({
        type: 'GET',
        url: '/allEmp',
        success: function(Eresponse ){
          console.log('Alex! This is neat. Checkout my jam: ', Eresponse);
          document.getElementById('tablesOutput').innerHTML = '';
          // loop through the tables array and display each table
          // select to assign a server to this table
          var selectText = '<select>';
          for (var i = 0; i < Eresponse.length; i++) {
            selectText+= '<option value=' + i + '>'+ Eresponse[i].first_name + ' ' + Eresponse[i].last_name + '</option>';
          }
          selectText += '</select>';
          // display employees
           for( i=0; i< Tresponse.length; i++ ){
            // status is a button that, when clicked runs cycleStatus for this table
            var line = Tresponse[i].name + " - capacity: " + Tresponse[i].capacity + ', server: ' + selectText + ', status: <button onClick="cycleStatus(' + i + ')">' + Tresponse[i].status + "</button>";
            // add line to output div
            document.getElementById('tablesOutput').innerHTML += '<p>' + line + '</p>';
          }
        }
      });
    }
  });//end GET ajax
  // target our output div
  document.getElementById('tablesOutput').innerHTML = '';
  // loop through the tables array and display each table
  // select to assign a server to this table
  var selectText = '<select>';
  for (var i = 0; i < employees.length; i++) {
    selectText+= '<option value=' + i + '>'+ employees[i].firstName + ' ' + employees[i].lastName + '</option>';
  }
  selectText += '</select>';
  // display employees
   for( i=0; i< tables.length; i++ ){
    // status is a button that, when clicked runs cycleStatus for this table
    var line = tables[i].name + " - capacity: " + tables[i].capacity + ', server: ' + selectText + ', status: <button onClick="cycleStatus(' + i + ')">' + tables[i].status + "</button>";
    // add line to output div
    document.getElementById('tablesOutput').innerHTML += '<p>' + line + '</p>';
  }
}; // end listTables
