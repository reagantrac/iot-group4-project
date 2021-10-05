<?php
$servername="localhost";
$username="root";
$password="";
$dbname="nimabi";
$light_id = "";
$brightness = "";
$switch = "";
$result = "";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
	try{
		$conn=mysqli_connect($servername,$username,$password,$dbname);
	}catch(MySQLi_Sql_Exception $ex){
		echo("error in connecting");
	}

function getData()
    {
        $data = array();
        $data[0] = $_GET['light_id'];
      //  $data[1] = $_POST['brightness'];
      //  $data[2] = $_POST['switch'];
        return $data;
    }

// search
if(isset($_GET['light_id']))
{
	$info= getData();
	$search_query="SELECT * FROM `light` WHERE light_id='$info[0]'";
	$search_result=mysqli_query($conn,$search_query);
		if($search_result)
		{
			if(mysqli_num_rows($search_result))
			{
				 while($rows=mysqli_fetch_array($search_result))
				 {
					 $light_id= $rows['light_id'];
					 $brightness= $rows['brightness'];
					 $switch= $rows['switch'];
				 }
                 echo($brightness);
			}else{
				echo("no data are available");
			}
		}else{
			echo("result error"); 
		}
}

?>