class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }

    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) {
		this.drawRectangle({x: 200, y: 200}, {x: 400, y: 300}, [52, 235, 100, 255], framebuffer);
		
		
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {
		this.drawCircle({x: 200, y: 200}, 150, [60, 50, 168, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {
		this.drawBezierCurve({x: 500, y: 500}, {x: 600, y: 100}, {x: 400, y: 100}, {x: 300, y: 200}, [168, 50, 162, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {
		//B - circles and line
		this.drawLine({x: 200, y: 300}, {x: 200, y: 400}, [81, 50, 168, 255], framebuffer);
		this.drawCircle({x: 225, y: 375}, 25, [81, 50, 168, 255], framebuffer);
		this.drawCircle({x: 225, y: 325}, 25, [81, 50, 168, 255], framebuffer);
		
		if(this.show_points)
		{
			this.drawVertex({x: 200, y: 300}, framebuffer);
			this.drawVertex({x: 200, y: 400}, framebuffer);
		
		}
		
		//e - two curves
		this.drawBezierCurve({x: 300, y: 300}, {x: 275, y: 300}, {x: 250, y: 350}, {x: 300, y: 350}, [81, 50, 168, 255], framebuffer);
		this.drawBezierCurve({x: 272, y: 325}, {x: 300, y: 325}, {x: 325, y: 325}, {x: 300, y: 350}, [81, 50, 168, 255], framebuffer);
		
		//n - line and curve
		this.drawLine({x: 340, y: 300}, {x: 340, y: 350}, [81, 50, 168, 255], framebuffer);
		this.drawBezierCurve({x: 340, y: 338}, {x: 360, y: 340}, {x: 380, y: 340}, {x: 380, y: 300}, [81, 50, 168, 255], framebuffer);
		
		if(this.show_points)
		{
			this.drawVertex({x: 340, y: 300}, framebuffer);
			this.drawVertex({x: 340, y: 350}, framebuffer);
		}

    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawRectangle(left_bottom, right_top, color, framebuffer) {
		var right_bottom = {x: right_top.x, y: left_bottom.y};
    	var left_top = {x: left_bottom.x, y: right_top.y};
		
        this.drawLine(left_bottom, right_bottom, color, framebuffer);
        this.drawLine(right_bottom, right_top, color, framebuffer);
        this.drawLine(right_top, left_top, color, framebuffer);
        this.drawLine(left_top, left_bottom, color, framebuffer);
		
		if(this.show_points)
		{
			this.drawVertex(left_bottom, framebuffer);
			this.drawVertex(right_bottom, framebuffer);
			this.drawVertex(right_top, framebuffer);
			this.drawVertex(left_top, framebuffer);
		}
    }
	
	drawVertex(center, framebuffer)
	{
		this.drawCircle(center, 5, [235, 52, 52, 255], framebuffer);
	}
	
	

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCircle(center, radius, color, framebuffer) {
        var x0;
		var x1;
		var y0;
		var y1;
		var pt0;
		var pt1;
		var increment = (2 * Math.PI)/this.num_curve_sections;
		let points = [];
        for(var i=0; i < 2*Math.PI; i = i + increment)
        {
            x0 = Math.round(center.x + radius * Math.cos(i - ((2 * Math.PI) / this.num_curve_sections)));
            x1 = Math.round(center.x + radius * Math.cos(i));
			y0 = Math.round(center.y + radius * Math.sin(i - ((2 * Math.PI) / this.num_curve_sections)));
            y1 = Math.round(center.y +radius * Math.sin(i));
			
            pt0 = {x: x0, y: y0};
            pt1 = {x: x1, y: y1};
			
            this.drawLine(pt0, pt1, color, framebuffer);
			
			points.push(pt0);
			
        }
		/*
		if(this.show_points)
		{
			console.log(points.length);
		
			for(var i = 0; i < points.length; i++)
			{
				console.log(points[i]);
				this.drawLine(points[i].x + 100, points[i].y +100, [81, 50, 168, 255] , framebuffer);
				
			}
		}
		*/
		
    }
	
	 

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(pt0, pt1, pt2, pt3, color, framebuffer) {
        var x_start = pt0.x;
        var y_start = pt0.y;
        var x_next;
        var y_next;
		var length = 1/this.num_curve_sections;
        var t = 0;
		let points = [];
       
        for (var i = 0; i <= this.num_curve_sections; i++) 
		{
        	x_next = Math.round(Math.pow((1-t), 3) * pt0.x + 3 * Math.pow((1-t), 2) * t * pt1.x + 3 * (1-t) * t * t * pt2.x + Math.pow(t, 3) * pt3.x);
 			y_next = Math.round(Math.pow((1-t), 3) * pt0.y + 3 * Math.pow((1-t), 2) * t * pt1.y + 3 * (1-t) * t * t * pt2.y + Math.pow(t, 3) * pt3.y);
			
 			this.drawLine({x: x_start, y: y_start}, {x: x_next, y: y_next}, color, framebuffer);
			
			points.push({x: x_start, y: y_start});
 			
        	x_start = x_next;
        	y_start = y_next;
			
        	t = t + length;
        }
		
		points.push({x: x_next, y: y_next});
		
		if(this.show_points)
		{
			for(var i = 0; i < points.length; i++)
			{
				this.drawVertex(points[i], framebuffer);
			}
		}
		
		
    }
	

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawLine(pt0, pt1, color, framebuffer)
    {
        //if change in x is bigger than change in y, drawline low
		if (Math.abs(pt1.y - pt0.y) <= Math.abs(pt1.x - pt0.x)) 
		{
			if (pt0.x < pt1.x) 
			{
				this.drawLineLow(pt0.x, pt0.y, pt1.x, pt1.y, color, framebuffer);
			}
			else
			{
				this.drawLineLow(pt1.x, pt1.y, pt0.x, pt0.y, color, framebuffer);
			}
		} 
		else 
		{
			if (pt0.y < pt1.y) 
			{
				this.drawLineHigh(pt0.x, pt0.y, pt1.x, pt1.y, color, framebuffer);
			}
			else
			{
				this.drawLineHigh(pt1.x, pt1.y, pt0.x, pt0.y, color, framebuffer);
			}
		}
		
		
    }

    drawLineLow(x0, y0, x1, y1, color, framebuffer) {
		var A = y1 - y0;
		var B = x0 - x1;
		var iy = 1; 
		if (A < 0) {
			
			iy = -1;
			A *= -1;
		}
		var x = x0;
		var y = y0;
		var d = 2 * A + B;
		var px;
		
		while (x <= x1) {
			px = this.pixelIndex(x, y, framebuffer);
			this.setFramebufferColor(framebuffer, px, color);
			x = x + 1;
			if (d <= 0) {
				d = d + 2*A;
				
				
			} else {
				d = d + 2*A + 2*B;
				y = y + iy;
			}
			
		}
		
	}

	drawLineHigh(x0, y0, x1, y1, color, framebuffer) {
		var A = x1 - x0;
		var B = y0 - y1;
		var ix = 1; 
		if (A < 0) {
			ix = -1;
			A *= -1;
		}
		var x = x0;
		var y = y0;
		var d = 2 * A + B;
		var px;
		
		while (y <= y1) {
			px = this.pixelIndex(x, y, framebuffer);
			this.setFramebufferColor(framebuffer, px, color);
			y = y + 1;
			if (d <= 0) {
				d = d + 2*A;
				
				
			} else {
				d = d + 2*A + 2*B;
				x = x+ ix;
			}
			
		}
	}
	

	setFramebufferColor(framebuffer, px, color) {
		framebuffer.data[px + 0] = color[0];
		framebuffer.data[px + 1] = color[1];
		framebuffer.data[px + 2] = color[2];
		framebuffer.data[px + 3] = color[3];
	}

	pixelIndex(x, y, framebuffer) {
		return 4 * y * framebuffer.width + 4 * x;
	}
};
