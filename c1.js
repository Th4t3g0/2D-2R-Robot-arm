
//set up 
let l1=100;
let l2=150;
let q=-1;
var PenUp=1;//
let pos =[200,200];
let xx1=0;
let yy1=0;
const T = [
  [1, 0, 0, 60],
  [1, 1, 0, 20],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];
///Transformation matrix

function Kinematics() {
    console.log("Hello World ||");
}

function ForwardKinematics(th1,th2) {
    let th_rad1 =th1*Math.PI/180;
    let th_rad2 =th2*Math.PI/180;

    let x = l1*Math.cos(th_rad1)+l2*Math.cos(th_rad1+th_rad2);
    let y =l1*Math.sin(th_rad1)+l2*Math.sin(th_rad1+th_rad2);

let output=[x,y];
return output;
}

function InverseKinematics(A) {
    
    let th1 = Math.atan2(((T[1][3]-l2*T[1][0])/l1),((T[0][3]-l2*T[0][0])/l1))
    
    let th12 = Math.atan2(T[1][0], T[0][0]);

    let th2 = th12-th1;

    
    let output=[th1,th2];
    return output;
}
function Reach(x,y) {
    return Math.sqrt(x*x+y*y);
}

function InverseKinematicsCC(x,y) {
    let th1 = 90;
    let th2 = 90;
    let output=[th1,th2];
    if (Reach(x,y) > l1+l2) {
        //console.log("Out of range");
        //console.log(Reach(x,y))
        return output;
    }

     th2 = Math.acos((x * x + y * y - l1 * l1 - l2 * l2) / (2 * l1 * l2));
     th1 = Math.atan2(y, x) - Math.atan2(l2 * Math.sin(th2),l1 + l2 * Math.cos(th2));
    output=[th1,th2];
    return output;
}

function JointLocation(th1,th2) {
    let x1 = l1*Math.cos(th1);
    let y1 =l1*Math.sin(th1);

    let x2 = l1*Math.cos(th1)+l2*Math.cos(th1+th2);
    let y2 =l1*Math.sin(th1)+l2*Math.sin(th1+th2);
 

    
    let joint = [x1,y1,x2,y2]
    return joint;
}



function DrawLoop(joint) {

    ///Draw the firlst link from base to joint 1
      document.getElementById('link1').setAttribute('x1', 0);
      document.getElementById('link1').setAttribute('y1', 0);
      document.getElementById('link1').setAttribute('x2', joint[0]);
      document.getElementById('link1').setAttribute('y2', joint[1]);

      document.getElementById('link2').setAttribute('x1', joint[0]);
      document.getElementById('link2').setAttribute('y1', joint[1]);
      document.getElementById('link2').setAttribute('x2', joint[2]);
      document.getElementById('link2').setAttribute('y2', joint[3]);
      document.getElementById('EE').setAttribute('cx', joint[2]);
      document.getElementById('EE').setAttribute('cy', joint[3]);
    
}
///////////////////////


function Drawer() {
    
Random();
    console.log("x:" +pos[0]);
    console.log("y:" +pos[1]);
let angles=InverseKinematicsCC(pos[0]+200,pos[1]);
let joints = JointLocation(angles[0],angles[1]);
DrawLoop(joints,angles[2],angles[3]);

}

function Random() {
    pos[0]=pos[0]+Math.random();
    pos[1]=pos[1]+Math.random();
}

const svg = document.getElementById('robotArm');
const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
path.setAttribute('stroke', 'black');
path.setAttribute('fill', 'none');
svg.appendChild(path);

let pathData = '';

function addPointToPath(x, y) {
    if(PenUp){
        
        pathData += `M ${x},${y}`;
        return;
    }
  if (pathData === '') {
    pathData = `M ${x},${y}`; // Start new path
  } else {
    pathData += ` L ${x},${y}`; // Add line segment
  }
  path.setAttribute('d', pathData); // Update path
}


function followMouse() {

    const svg = document.getElementById('robotArm');

   svg.addEventListener('mousemove', function(event) {
  
  const pt = svg.createSVGPoint();
  pt.x = event.clientX+400;
  pt.y = event.clientY;
  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
  let angles=InverseKinematicsCC(svgP.x.toFixed(2)+200,svgP.y.toFixed(2));
  let joints = JointLocation(angles[0],angles[1]);
  DrawLoop(joints,angles[2],angles[3]);

});

}


function followMous() {

    const svg = document.getElementById('robotArm');

   svg.addEventListener('mousemove', function(event) {
  
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
  addPointToPath(svgP.x.toFixed(2),svgP.y.toFixed(2));
 
});
    svg.addEventListener('mousedown', function(event) {PenUp=!PenUp; });

}
followMous();
followMouse();