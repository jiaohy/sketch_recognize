/**
 * The $P Point-Cloud Recognizer (JavaScript version)
 *
 * 	Radu-Daniel Vatavu, Ph.D.
 *	University Stefan cel Mare of Suceava
 *	Suceava 720229, Romania
 *	vatavu@eed.usv.ro
 *
 *	Lisa Anthony, Ph.D.
 *      UMBC
 *      Information Systems Department
 *      1000 Hilltop Circle
 *      Baltimore, MD 21250
 *      lanthony@umbc.edu
 *
 *	Jacob O. Wobbrock, Ph.D.
 * 	The Information School
 *	University of Washington
 *	Seattle, WA 98195-2840
 *	wobbrock@uw.edu
 *
 * The academic publication for the $P recognizer, and what should be 
 * used to cite it, is:
 *
 *	Vatavu, R.-D., Anthony, L. and Wobbrock, J.O. (2012).  
 *	  Gestures as point clouds: A $P recognizer for user interface 
 *	  prototypes. Proceedings of the ACM Int'l Conference on  
 *	  Multimodal Interfaces (ICMI '12). Santa Monica, California  
 *	  (October 22-26, 2012). New York: ACM Press, pp. 273-280.
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (c) 2012, Radu-Daniel Vatavu, Lisa Anthony, and 
 * Jacob O. Wobbrock. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University Stefan cel Mare of Suceava, 
 *	University of Washington, nor UMBC, nor the names of its contributors 
 *	may be used to endorse or promote products derived from this software 
 *	without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Radu-Daniel Vatavu OR Lisa Anthony
 * OR Jacob O. Wobbrock BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT 
 * OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y, id) // constructor
{
	this.X = x;
	this.Y = y;
	this.ID = id; // stroke ID to which this point belongs (1,2,...)
}
//
// PointCloud class: a point-cloud template
//
function PointCloud(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	this.Points = Scale(this.Points);
	this.Points = TranslateTo(this.Points, Origin);
}
//
// Result class
//
function Result(name, score) // constructor
{
	this.Name = name;
	this.Score = score;
}
//
// PDollarRecognizer class constants
//
var NumPointClouds = 12;
var NumPoints = 32;
var Origin = new Point(0,0,0);
//
// PDollarRecognizer class
//
function PDollarRecognizer() // constructor
{
	//
	// one predefined point-cloud for each gesture
	//
	this.PointClouds = new Array(NumPointClouds);
	this.PointClouds[0] = new PointCloud("capacitor", new Array(
		new Point(281,235,1),new Point(281,308,1),
		new Point(294,235,2),new Point(294,308,2)
	));
	this.PointClouds[1] = new PointCloud("earthground", new Array(
		new Point(226,418,1),new Point(347,418,1),
		new Point(248,438,2),new Point(326,438,2),
		new Point(268,459,3),new Point(305,459,3)
	));
	this.PointClouds[2] = new PointCloud("resistor", new Array(
		new Point(566,393,1),new Point(644,393,1),
		new Point(566,393,2),new Point(566,423,2),
		new Point(566,423,3),new Point(644,423,3),
		new Point(644,393,4),new Point(644,423,4)
	));
	this.PointClouds[3] = new PointCloud("inductor", new Array(
		new Point(284,403,1),new Point(286,386,1),new Point(290,375,1),new Point(298,362,1),new Point(304,355,1),new Point(311,350,1),
		new Point(319,347,1),new Point(328,344,1),new Point(336,343,1),new Point(343,343,1),new Point(351,344,1),new Point(362,348,1),
		new Point(370,352,1),new Point(379,361,1),new Point(386,371,1),new Point(391,380,1),new Point(394,395,1),new Point(394,403,1),
		new Point(398,379,1),new Point(403,370,1),new Point(408,362,1),new Point(415,354,1),new Point(424,349,1),new Point(433,345,1),
		new Point(442,343,1),new Point(448,343,1),new Point(465,345,1),new Point(476,349,1),new Point(495,367,1),new Point(500,377,1),
		new Point(504,392,1),new Point(504,403,1),
		new Point(507,383,1),new Point(514,369,1),new Point(521,360,1),new Point(533,350,1),new Point(545,344,1),new Point(556,342,1),
		new Point(567,343,1),new Point(583,348,1),new Point(594,354,1),new Point(604,367,1),new Point(608,374,1),new Point(611,384,1),
		new Point(615,393,1),new Point(616,400,1)
	));
	this.PointClouds[4] = new PointCloud("switch", new Array(
		new Point(356,469,1),new Point(358,449,1),new Point(361,434,1),new Point(368,413,1),new Point(377,400,1),new Point(389,385,1),
		new Point(405,373,1),new Point(419,367,1),new Point(438,361,1),new Point(456,359,1),new Point(466,360,1),new Point(483,363,1),
		new Point(496,367,1),new Point(512,375,1),new Point(527,387,1),new Point(537,400,1),new Point(547,416,1),new Point(554,434,1),
		new Point(556,452,1),new Point(556,473,1),new Point(550,494,1),new Point(543,509,1),new Point(531,525,1),new Point(518,538,1),
		new Point(509,543,1),new Point(497,550,1),new Point(478,556,1),new Point(457,558,1),new Point(435,556,1),new Point(419,551,1),
		new Point(403,542,1),new Point(392,534,1),new Point(382,524,1),new Point(372,510,1),new Point(363,495,1),new Point(359,479,1),
		new Point(358,470,1),
		new Point(528,388,2),new Point(1017,27,2)
	));
	this.PointClouds[5] = new PointCloud("lamp", new Array(
		new Point(356,469,1),new Point(358,449,1),new Point(361,434,1),new Point(368,413,1),new Point(377,400,1),new Point(389,385,1),
		new Point(405,373,1),new Point(419,367,1),new Point(438,361,1),new Point(456,359,1),new Point(466,360,1),new Point(483,363,1),
		new Point(496,367,1),new Point(512,375,1),new Point(527,387,1),new Point(537,400,1),new Point(547,416,1),new Point(554,434,1),
		new Point(556,452,1),new Point(556,473,1),new Point(550,494,1),new Point(543,509,1),new Point(531,525,1),new Point(518,538,1),
		new Point(509,543,1),new Point(497,550,1),new Point(478,556,1),new Point(457,558,1),new Point(435,556,1),new Point(419,551,1),
		new Point(403,542,1),new Point(392,534,1),new Point(382,524,1),new Point(372,510,1),new Point(363,495,1),new Point(359,479,1),
		new Point(358,470,1),
		new Point(360,412,2),new Point(497,547,2),
		new Point(360,490,3),new Point(497,360,3)
	));
	this.PointClouds[6] = new PointCloud("AC", new Array(
		new Point(356,469,1),new Point(358,449,1),new Point(361,434,1),new Point(368,413,1),new Point(377,400,1),new Point(389,385,1),
		new Point(405,373,1),new Point(419,367,1),new Point(438,361,1),new Point(456,359,1),new Point(466,360,1),new Point(483,363,1),
		new Point(496,367,1),new Point(512,375,1),new Point(527,387,1),new Point(537,400,1),new Point(547,416,1),new Point(554,434,1),
		new Point(556,452,1),new Point(556,473,1),new Point(550,494,1),new Point(543,509,1),new Point(531,525,1),new Point(518,538,1),
		new Point(509,543,1),new Point(497,550,1),new Point(478,556,1),new Point(457,558,1),new Point(435,556,1),new Point(419,551,1),
		new Point(403,542,1),new Point(392,534,1),new Point(382,524,1),new Point(372,510,1),new Point(363,495,1),new Point(359,479,1),
		new Point(358,470,1),
		new Point(372,459,2),new Point(379,475,2),new Point(387,488,2),new Point(396,494,2),new Point(406,500,2),new Point(416,501,2),
		new Point(426,499,2),new Point(435,495,2),new Point(444,484,2),new Point(449,478,2),new Point(454,467,2),new Point(459,457,2),
		new Point(464,443,2),new Point(470,434,2),new Point(475,427,2),new Point(482,422,2),new Point(490,417,2),new Point(501,416,2),
		new Point(517,421,2),new Point(529,433,2),new Point(536,441,2),new Point(542,455,2)
	));
	for (var i = 7; i < NumPointClouds; i++) {
		tmpPoints = this.PointClouds[i - 7].Points;
		var pointsArray = [];
		for (var j = 0; j < tmpPoints.length; j++) {
			var x = tmpPoints[j].Y;
			var y = tmpPoints[j].X;
			var id = tmpPoints[j].ID;
			pointsArray.splice(pointsArray.length, 0, new Point(x, y, id));
		};
		this.PointClouds[i] = new PointCloud(this.PointClouds[i - 7].Name, pointsArray);
	}
	//
	// The $P Point-Cloud Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), DeleteUserGestures()
	//
	this.Recognize = function(points)
	{
		points = Resample(points, NumPoints);
		points = Scale(points);
		points = TranslateTo(points, Origin);
		
		var b = +Infinity;
		var u = -1;
		for (var i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
		{
			var d = GreedyCloudMatch(points, this.PointClouds[i]);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // point-cloud
			}
		}
		return (u == -1) ? new Result("No match.", 0.0) : new Result(this.PointClouds[u].Name, Math.max((b - 2.0) / -2.0, 0.0));
	};
	this.AddGesture = function(name, points)
	{
		this.PointClouds[this.PointClouds.length] = new PointCloud(name, points);
		var num = 0;
		for (var i = 0; i < this.PointClouds.length; i++) {
			if (this.PointClouds[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.PointClouds.length = NumPointClouds; // clear any beyond the original set
		return NumPointClouds;
	}
}
//
// Private helper functions from this point down
//
function GreedyCloudMatch(points, P)
{
	var e = 0.50;
	var step = Math.floor(Math.pow(points.length, 1 - e));
	var min = +Infinity;
	for (var i = 0; i < points.length; i += step) {
		var d1 = CloudDistance(points, P.Points, i);
		var d2 = CloudDistance(P.Points, points, i);
		min = Math.min(min, Math.min(d1, d2)); // min3
	}
	return min;
}
function CloudDistance(pts1, pts2, start)
{
	var matched = new Array(pts1.length); // pts1.length == pts2.length
	for (var k = 0; k < pts1.length; k++)
		matched[k] = false;
	var sum = 0;
	var i = start;
	do
	{
		var index = -1;
		var min = +Infinity;
		for (var j = 0; j < matched.length; j++)
		{
			if (!matched[j]) {
				var d = Distance(pts1[i], pts2[j]);
				if (d < min) {
					min = d;
					index = j;
				}
			}
		}
		matched[index] = true;
		var weight = 1 - ((i - start + pts1.length) % pts1.length) / pts1.length;
		sum += weight * min;
		i = (i + 1) % pts1.length;
	} while (i != start);
	return sum;
}
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		if (points[i].ID == points[i-1].ID)
		{
			var d = Distance(points[i - 1], points[i]);
			if ((D + d) >= I)
			{
				var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
				var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
				var q = new Point(qx, qy, points[i].ID);
				newpoints[newpoints.length] = q; // append new point 'q'
				points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
				D = 0.0;
			}
			else D += d;
		}
	}
	if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].ID);
	return newpoints;
}
function Scale(points)
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	var size = Math.max(maxX - minX, maxY - minY);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - minX) / size;
		var qy = (points[i].Y - minY) / size;
		newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
	}
	return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
	}
	return newpoints;
}
function Centroid(points)
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y, 0);
}
function PathDistance(pts1, pts2) // average distance between corresponding points in two paths
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points) // length traversed by a point path
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
	{
		if (points[i].ID == points[i-1].ID)
			d += Distance(points[i - 1], points[i]);
	}
	return d;
}
function Distance(p1, p2) // Euclidean distance between two points
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}
