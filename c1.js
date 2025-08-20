
//set up 
let l1=100;
let l2=100;
let l3=100;
let q=-1;
let PenUp=true;//
let pos =[200,200];
let tcp=[0,0];
let xx1=0;
let yy1=0;
const T = [
  [1, 0, 0, 60],
  [1, 1, 0, 20],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];
///Transformation matrix


///To Use
function ForwardKinematic(th1,th2,th3) {
    let th_rad1 =th1//*Math.PI/180;
    let th_rad2 =th2//*Math.PI/180;
    let th_rad3=th3//*Math.PI/180;

    let x = l1*Math.cos(th_rad1)+l2*Math.cos(th_rad1+th_rad2)+l3*Math.cos(th_rad1+th_rad2+th_rad3);
    let y =l1*Math.sin(th_rad1)+l2*Math.sin(th_rad1+th_rad2)+l3*Math.sin(th_rad1+th_rad2+th_rad3);
    return [x,y];
}


//To USE
function InverseKinematic(x,y) {
    let alpha=Math.atan2(y,x);// aplha = theta1 + theta2 + theta3
    x2=x-l3*Math.cos(alpha);
    y2=y-l3*Math.sin(alpha);
    let c2 = ((x2*x2)+(y2*y2)-(l1*l1)-(l2*l2))/(2*l1*l2);
    let s2 =Math.sqrt(Math.max(0,1-c2*c2));

    let theta2 = Math.atan2(s2,c2); //Theta 2

    let dev =((l1+l2*c2)**2) +(l2**2)*(s2**2); 


    let s1 =(y2*(l1+l2*c2)-x2*(l2*s2))/(dev) ;
    let c1 = (x2*(l1+l2*c2)+y2*(l2*s2))/(dev)

    let theta1=Math.atan2(s1,c1);
    let theta3 =alpha-theta1-theta2;

    output =[theta1,theta2,theta3];
    
    return output;
}



function Reach(x,y) {
    return Math.sqrt(x*x+y*y);
}


function JointLocation(A) {
    let x1 = l1*Math.cos(A[0]);
    let y1 =l1*Math.sin(A[0]);

    let x2 = l1*Math.cos(A[0])+l2*Math.cos(A[0]+A[1]);
    let y2 =l1*Math.sin(A[0])+l2*Math.sin(A[0]+A[1]);

    let x3=l1*Math.cos(A[0])+l2*Math.cos(A[0]+A[1])+l3*Math.cos(A[0]+A[1]+A[2]);
    let y3=l1*Math.sin(A[0])+l2*Math.sin(A[0]+A[1])+l3*Math.sin(A[0]+A[1]+A[2]);
 

    
    let joint = [x1,y1,x2,y2,x3,y3];
    return joint;
}




function stroke(V) {
    let l = V[0];
    let angle = V[1]; 

    let step = 0.05; // segment length
    let n = Math.ceil(l / step);

    let sx = tcp[0];
    let sy = tcp[1];

    let output=[0,0];

    for (let ii = 1; ii <= n; ii++) {
        let dx = sx + (l * ii / n) * Math.cos(angle);
        let dy = sy + (l * ii / n) * Math.sin(angle);

        // wobble
        dx += (Math.random() - 0.5) * .8; 
        dy += (Math.random() - 0.5) * .8; 


        
        //console.log(dx);

        const newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        newLine.setAttribute("x1", sx);
        newLine.setAttribute("y1", sy);
        newLine.setAttribute("x2", dx);
        newLine.setAttribute("y2", dy);
        newLine.setAttribute("stroke", "black");
        newLine.setAttribute("stroke-width", "2");
        newLine.setAttribute("stroke-linecap", "round");
        newLine.classList.add("strokes");

        
        setTimeout(() => {


            
            if (!PenUp) {
                LL(dx,dy);
                document.getElementById("robotArm").appendChild(newLine);
            }
            
           
        }, ii * 30);

         sx = dx;
         sy = dy;

        if(ii==n){
            LL(dx,dy);
        }
        
        output=[dx,dy];
        tcp=[dx,dy];
        
    }
    console.log(output[0]);
    console.log(output[1]);
    return output;
}


PenUp=false;
D =[3,-Math.PI/2]
stroke(D);




    






  












function DrawLoop(joint) {

    //console.log(joint[4]);
    ///Draw the firlst link from base to joint 1
      document.getElementById('link1').setAttribute('x1', 0);
      document.getElementById('link1').setAttribute('y1', 0);
      document.getElementById('link1').setAttribute('x2', joint[0]);
      document.getElementById('link1').setAttribute('y2', joint[1]);
    
      document.getElementById('j1').setAttribute('cx', joint[0]);
      document.getElementById('j1').setAttribute('cy', joint[1]);

      document.getElementById('link2').setAttribute('x1', joint[0]);
      document.getElementById('link2').setAttribute('y1', joint[1]);
      document.getElementById('link2').setAttribute('x2', joint[2]);
      document.getElementById('link2').setAttribute('y2', joint[3]);

      document.getElementById('j2').setAttribute('cx', joint[2]);
      document.getElementById('j2').setAttribute('cy', joint[3]);
    
      document.getElementById('link3').setAttribute('x1', joint[2]);
      document.getElementById('link3').setAttribute('y1', joint[3]);
      document.getElementById('link3').setAttribute('x2', joint[4]);
      document.getElementById('link3').setAttribute('y2', joint[5]);


    
      document.getElementById('EE').setAttribute('cx', joint[4]);
      document.getElementById('EE').setAttribute('cy', joint[5]);
    
}
///////////////////////




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
  let angles=InverseKinematic(svgP.x.toFixed(2)+200,svgP.y.toFixed(2));
  let joints = JointLocation(angles);
  DrawLoop(joints);

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



function LL(x,y) {
  let angles=InverseKinematic(x+200,y);
  let joints = JointLocation(angles);
  DrawLoop(joints);
}

