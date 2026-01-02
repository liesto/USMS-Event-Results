<?php
include "usmsdefs.php";
include_once "$sitedb/database/classautoloader.php";
include_once "$sitedb/database/forums/validate.php";
$noLocalNav = FALSE; // Change to TRUE to inhibit left and right navigation areas

$age = 0;
$metricAge = 0;
$lowOptions = "";
$lowOptionsMeters = "";
$highOptions = "";
$highOptionsMeters = "";

function get_swimmer_id_from_vb_id($pdoLink, $vbID)
{
	$SwimmerID = "";
    $sql = "SELECT SwimmerID FROM MemberLink WHERE vbUserID = :vbid";
    if ($query = $pdoLink->prepare($sql))
    {
        $bindValues = array();
        $bindValues[":vbid"] = $vbID;
        
        if ($query->execute($bindValues))
        {
            if ($row = $query->fetch(\PDO::FETCH_ASSOC))
            {
                $SwimmerID = $row["SwimmerID"];
            }
        }
	}
	return $SwimmerID;
}



if ($pdoLink = \Database::GetInstance()->GetPDO())
{
    if ($vbID = getForumsUserID())
    //if (isset($_COOKIE["bbuserid"]))
    {
        $SwimmerID = get_swimmer_id_from_vb_id($pdoLink, $vbID);
        if ($SwimmerID)
        {
            $birthdaySql = "SELECT YEAR(BirthDate) AS BirthYear, MONTH(BirthDate) AS BirthMonth, DAY(BirthDate) AS BirthMonth FROM People WHERE SwimmerID = :swimmerid";
            if ($birthdayQuery = $pdoLink->prepare($birthdaySql))
            {
                $bindValues = array();
                $bindValues[":swimmerid"] = $SwimmerID;
                
                if ($birthdayQuery->execute($bindValues))
                {
                    if ($swimmer = $birthdayQuery->fetch(\PDO::FETCH_ASSOC))
                    {
                        $age = date("Y") - $swimmer["BirthYear"];
                        $metricAge = $age;
                        if ((date("n") < $swimmer["BirthMonth"]) OR
                             (date("n") == $swimmer["BirthMonth"] AND date("j") <= $swimmer["BirthMonth"])
                            )
                        {
                            $age--;
                        }
                    }
                }
            }
        }
    }
	
    $ageGroupSql = "SELECT MinAge, MaxAge FROM AgeGroups ORDER BY AgeGroupID";
    if ($ageGroupQuery = $pdoLink->query($ageGroupSql))
    {
        while ($ageGroup = $ageGroupQuery->fetch(\PDO::FETCH_ASSOC))
        {
            if ($age >= $ageGroup["MinAge"] AND $age <= $ageGroup["MaxAge"])
            {
                $yardsSelected = " selected=\"selected\"";
            }
            else
            {
                $yardsSelected = "";
            }
            if ($metricAge >= $ageGroup["MinAge"] AND $metricAge <= $ageGroup["MaxAge"])
            {
                $metersSelected = " selected=\"selected\"";
            }
            else
            {
                $metersSelected = "";
            }
            $lowOptions .= "<option value=\"" . $ageGroup["MinAge"] . "\"" . $yardsSelected . ">" . $ageGroup["MinAge"] . "</option>\n";
            $lowOptionsMeters .= "<option value=\"" .  $ageGroup["MinAge"] . "\"" . $metersSelected . ">" . $ageGroup["MinAge"] . "</option>\n";
            $highOptions .= "<option value=\"" . $ageGroup["MaxAge"] . "\"" . $yardsSelected . ">" . $ageGroup["MaxAge"] . "</option>\n";
            $highOptionsMeters .= "<option value=\"" . $ageGroup["MaxAge"] . "\"" . $metersSelected . ">" . $ageGroup["MaxAge"] . "</option>\n";
        }
    }
}

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<?php include_once("$sitedb/database/layout/head_top.php"); ?>
<title>Meet Results Database Rankings</title>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
<link rel=STYLESHEET type="text/css" href="/usms.css">
<script language=javascript src="/menunav.js" type="text/JavaScript"></script>
<script language=javascript src="/dw_cookies.js" type="text/JavaScript"></script>
<?php include_once("$sitedb/database/layout/head_bottom.php"); ?>
</head>
<body onLoad="init();">
<?php include "$site/bodytop.php"; ?>

<!-- CONTENT START -->
<div class="contentbox">
<div class="contentbar">
<b><big>Meet Results Database Rankings</big></b>
</div>
<div class="contenttext">
<p class="contenttext">
Select an event for any age range in any of the three pool courses to view the ranked results from all available meet results for the current year. To view all of your personal meet results, consult the <a href="resultstrack.php">individual results area</a>.</p>
<p>If you are a meet director, please <a href="submitmeet.php">submit your meet results</a> for inclusion. Note that some meet results shown here may not appear in the end of year official published <a href="/comp/tt/">top ten</a> results if the meet results, conduct of the meet, or pool measurements do not meet USMS standards. <strong>These rankings are unofficial - for official year-end rankings, consult the <a href="/comp/tt/">USMS Top Ten list</a>.</strong>
</p>
<p class="contenttext">
<a href="/comp/meets/">List of meets available in the database</a>
</p>
<h3>Short Course Yards</h3>
<form action="/comp/meets/eventrank.php" method=post>
<table>
<tr><td align=RIGHT>
<b>Season:</b>
</td>
<td align=LEFT>
<select name="Season" size=1>
<option value="2019">2018-2019</option>
<option value="2018">2017-2018</option>
<option value="2017">2016-2017</option>
<option value="2016">2015-2016</option>
<option value="2015">2014-2015</option>
<option value="2014">2013-2014</option>
<option value="2013">2012-2013</option>
<option value="2012">2011-2012</option>
<option value="2011">2010-2011</option>
<option value="2010">2009-2010</option>
<option value="2009">2008-2009</option>
<option value="2008">2007-2008</option>
<option value="2007">2006-2007</option>
<option value="2006">2005-2006</option>
<option value="2005">2004-2005</option>
<option value="2004">2003-2004</option>
</select>
</td>
</tr>

<tr><td align=RIGHT>
<b>Gender:</b>
</td>
<td align=LEFT>
<select name="Sex" size=1>
<option value="M">Men</option>
<option value="F">Women</option>
</select>
</td>
</tr>
<tr><td align=RIGHT>
<b>Stroke:</b>
</td>
<td align=LEFT>
<select name="StrokeID" size=1>
<option value="2">Back</option>
<option value="3">Breast</option>
<option value="4">Fly</option>
<option  value="1" selected>Free</option>
<option value="5">IM</option>
</select>
</td>
</tr>
<tr><td align=RIGHT>
<b>Distance:</b>
</td>
<td align=LEFT>
<select name="Distance" size=1>
<option>25</option>
<option>50</option>
<option selected>100</option>
<option>200</option>
<option>400</option>
<option>500</option>
<option>1000</option>
<option>1650</option>
</select>
</td>
</tr>
<tr><td align=RIGHT>
<b>Ages:</b>
</td>
<td align=LEFT>
<select name="lowage" size=1>
<?php echo $lowOptions; ?>
</select>
<b>  through:</b> <select name="highage" size=1>
<?php echo $highOptions; ?>
</select>
</td>
</tr>
<tr><td align=RIGHT><b>Display Top:</b> </td>
<td align=LEFT>
<select name="How_Many" size=1>
<option>10</option>
<option>20</option>
<option>25</option>
<option>50</option>
<option selected>100</option>
<option>200</option>
<option>300</option>
<option>400</option>
<option>500</option>
</select>
</td>
</tr>
</table>

<input type=HIDDEN name="CourseID" value="1">

<p><input type="Submit" value="Start Search">
<input type="Reset"  value="Reset">
</form>


<p><hr>
<h3>Long Course Meters</h3>
<form action="/comp/meets/eventrank.php" method=post>
<table>
<tr><td align=RIGHT>
<b>Season:</b>
</td>
<td align=LEFT>
<select name="Season" size=1>
<option value="2018">2018</option>
<option value="2017">2017</option>
<option value="2016">2016</option>
<option value="2015">2015</option>
<option value="2014">2014</option>
<option value="2013">2013</option>
<option value="2012">2012</option>
<option value="2011">2011</option>
<option value="2010">2010</option>
<option value="2009">2009</option>
<option value="2008">2008</option>
<option value="2007">2007</option>
<option value="2006">2006</option>
<option value="2005">2005</option>
</select>
</td>
</tr>

<tr><td align=RIGHT>
<b>Gender:</b>
</td>
<td align=LEFT>
<select name="Sex" size=1>
<option value="M">Men</option>
<option value="F">Women</option>
</select>
</td>
</tr>
<tr><td align=RIGHT>
<b>Stroke:</b>
</td>
<td align=LEFT>
<select name="StrokeID" size=1>
<option value="2">Back</option>
<option value="3">Breast</option>
<option value="4">Fly</option>
<option  value="1" selected>Free</option>
<option value="5">IM</option>
</select>
</td>
</tr>
<tr><td align=RIGHT>
<b>Distance:</b>
</td>
<td align=LEFT>
<select name="Distance" size=1>
<option>50</option>
<option selected>100</option>
<option>200</option>
<option>400</option>
<option>800</option>
<option>1000</option>
<option>1500</option>
</select>
</td>
</tr>
<tr><td align=RIGHT>
<b>Ages:</b>
</td>
<td align=LEFT>
<select name="lowage" size=1>
<?php echo $lowOptionsMeters; ?>
</select>
<b>  through:</b> 
<select name="highage" size=1>
<?php echo $highOptionsMeters; ?>
</select>
</td>
</tr>
<tr><td align=RIGHT><b>Display Top:</b> </td>
<td align=LEFT>
<select name="How_Many" size=1>
<option>10</option>
<option>20</option>
<option>25</option>
<option>50</option>
<option selected>100</option>
<option>200</option>
<option>300</option>
<option>400</option>
<option>500</option>
</select>
</td>
</tr>
</table>

<input type=HIDDEN name="CourseID" value="2">
<p><input type="Submit" value="Start Search">
<input type="Reset"  value="Reset">
</form>


<p><hr>
<h3>Short Course Meters</h3>
<form action="/comp/meets/eventrank.php" method=post>
<table>
<tr><td align=RIGHT>
<b>Season:</b>
</td>
<td align=LEFT>
<select name="Season" size=1>
<option value="2018">2018</option>
<option value="2017">2017</option>
<option value="2016">2016</option>
<option value="2015">2015</option>
<option value="2014">2014</option>
<option value="2013">2013</option>
<option value="2012">2012</option>
<option value="2011">2011</option>
<option value="2010">2010</option>
<option value="2009">2009</option>
<option value="2008">2008</option>
<option value="2007">2007</option>
<option value="2006">2006</option>
<option value="2005">2005</option>
</select>
</td>
</tr>

<tr><td align=RIGHT>
<b>Gender:</b>
</td>
<td align=LEFT>
<select name="Sex" size=1>
<option value="M">Men</option>
<option value="F">Women</option>
</select>
</td>
</tr>
<tr><td align=RIGHT>
<b>Stroke:</b>
</td>
<td align=LEFT>
<select name="StrokeID" size=1>
<option value="2">Back</option>
<option value="3">Breast</option>
<option value="4">Fly</option>
<option  value="1" selected>Free</option>
<option value="5">IM</option>
</select>
</td>
</tr>
<tr><td align=RIGHT>
<b>Distance:</b>
</td>
<td align=LEFT>
<select name="Distance" size=1>
<option>25</option>
<option>50</option>
<option selected>100</option>
<option>200</option>
<option>400</option>
<option>800</option>
<option>1500</option>
</select>
</td>
</tr>
<tr><td align=RIGHT>
<b>Ages:</b>
</td>
<td align=LEFT>
<select name="lowage" size=1>
<?php echo $lowOptionsMeters; ?>
</select>
<b>  through:</b> 
<select name="highage" size=1>
<?php echo $highOptionsMeters; ?>
</select>
</td>
</tr>
<tr><td align=RIGHT><b>Display Top:</b> </td>
<td align=LEFT>
<select name="How_Many" size=1>
<option>10</option>
<option>20</option>
<option>25</option>
<option>50</option>
<option selected>100</option>
<option>200</option>
<option>300</option>
<option>400</option>
<option>500</option>
</select>
</td>
</tr>
</table>

<input type=HIDDEN name="CourseID" value="3">

<p><input type="Submit" value="Start Search">
<input type="Reset"  value="Reset">
</form>

</div>
</div>
<!-- CONTENT END -->
<?php include "$site/bodybottom.php"; ?>
</body>
</html>
