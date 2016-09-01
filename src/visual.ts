/*
 *  Stars custom visual
 *
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {

    export interface StarsData {
        value: number;
        min: number;
        max: number;
        target: number;
        valueLabel: string;
        minLabel: string;
        maxLabel: string;
        targetLabel: string;
        numStars: number;
        showLabel: boolean;
        showStroke: boolean;
        starStroke: string;
        starFill: string;
        emptyStarFill: string;
        valueAsPercent: boolean;
        valueWithSymbol: boolean;
        valueSymbol: string;
        visualSymbol: string;
        showTargetLabel: boolean;
        showMinMaxLabels: boolean;
        minMaxColor: string;
        targetColor: string;
    };

    export interface ISymbolColorConfig {
        fill: string;
        stroke: string;
    }

    export class Stars implements IVisual {

        // star properties
        private static internalStarWidth = 84.46;
        private static starMarginRight = 4;
        private static starPolygonPoints = "42.23 2.31 54.4 27.64 82.26 31.39 61.93 50.8 66.97 78.45 42.23 65.12 17.49 78.45 22.53 50.8 2.19 31.39 30.05 27.64 42.23 2.31";

        // dollar sign properties
        private static internalDollarSignWidth = 39.79;
        private static dollarSignMarginRight = 10;
        private static dollarSignPathPoints = "M22.4,70v9.3h-5.3v-9c-6.4,0-11.5-1.2-15.5-3.7v-9.6c1.7,1.5,4.1,2.8,7.1,3.8c3,1,5.8,1.5,8.4,1.5V43.4 C10.3,40.2,6,37.4,4,34.7S1,29,1,25.4c0-4.3,1.5-7.9,4.5-11c3-3.1,6.9-5,11.5-5.6V1h5.3v7.6c6,0.2,10.2,1,12.4,2.4v9.2 c-3.1-2.3-7.3-3.5-12.4-3.7v19.8c6.3,2.9,10.6,5.8,12.9,8.5c2.3,2.7,3.5,5.9,3.5,9.3c0,4.2-1.4,7.7-4.3,10.6 C31.5,67.4,27.5,69.2,22.4,70z M17.1,33.8V16.7C15,17.1,13.3,18,12,19.4c-1.3,1.4-1.9,3.1-1.9,5.1c0,2.1,0.5,3.8,1.5,5.2 C12.7,31.1,14.5,32.4,17.1,33.8z M22.4,45.7v16.5c4.9-1,7.3-3.6,7.3-7.6C29.7,51.2,27.2,48.2,22.4,45.7z";

        // heart properties
        private static internalHeartWidth = 92.46;
        private static heartMarginRight = 18;
        private static heartPathPoints = "M84.7,7.8c-9-9-23.7-9-32.7,0l-5.8,5.8l-5.8-5.8c-9-9-23.7-9-32.7,0s-9,23.7,0,32.7l5.8,5.8l32.7,32.7L79,46.2 l5.8-5.8C93.7,31.5,93.7,16.8,84.7,7.8z";

         // thumbs up properties
        private static internalThumbsupWidth = 92.6;
        private static thumbsupMarginRight = 18;
        private static thumbsupPathPoints = "M28,33.6v44.3c0,1.2-1,1.5-2.5,1.5H2.9c-1.2,0-1.9-0.2-1.9-1.5V33.6c0-1.2,0.6-4.2,1.9-4.2h22.6 C26.8,29.4,28,32.4,28,33.6z M86.2,25.3H73.8H61.3l-0.1-0.1l-0.1-0.1c0,0,1.1-1.3,1.6-4.1s0.3-7-2.4-12.8c-2.7-5.8-6.3-7.4-9.4-7.2 s-5.6,2.2-6.2,3.7C44.1,6.2,44,9.2,44,11.9c0,2.7,0.1,5,0.1,5l-5,8.9l-5,8.9l-2.4,0.9l-2.4,0.9v16.4v16.4c0,0,2.4,1.4,5.4,2.8 c3,1.4,6.6,2.8,9,2.8h1.1h1.1h11.8h11.8h1.8h1.8c0.7,0,2.5,0,4.4-0.6c1.9-0.6,3.8-1.7,4.7-4c0.9-2.3,3.2-10.8,5.3-18.8 c2.1-7.9,3.9-15.3,3.9-15.3c0.3-1.5-0.2-4.3-1.2-6.7C89.2,27.4,87.8,25.3,86.2,25.3z";

        // smiley properties
        private static internalSmileyWidth = 80.32;
        private static smileyMarginRight = 18;
        private static smileyPathPoints = "M40.2,0.2c-22.1,0-40,17.9-40,40s17.9,40,40,40s40-17.9,40-40S62.2,0.2,40.2,0.2z M51.8,23.4 c2.3,0,4.2,2.8,4.2,6.3S54.2,36,51.8,36s-4.2-2.8-4.2-6.3S49.5,23.4,51.8,23.4z M28.5,23.4c2.3,0,4.2,2.8,4.2,6.3S30.8,36,28.5,36 s-4.2-2.8-4.2-6.3S26.2,23.4,28.5,23.4z M61,55.5c-5.7,5.7-13.3,8.6-20.8,8.6s-15.1-2.9-20.8-8.6c-0.8-0.8-0.8-2.2,0-3 c0.8-0.8,2.2-0.8,3,0c9.9,9.9,25.9,9.8,35.7,0c0.8-0.8,2.2-0.8,3,0C61.8,53.4,61.8,54.7,61,55.5z";

        // accessbility symbol properties
        private static internalAccessbilityWidth = 74.25;
        private static accessbilityMarginRight = 12;
        private static accessbilityPathPoints1 = "M48.1,57.6c-2.8,8.2-10.5,13.8-19.2,13.8c-11.2,0-20.2-9.1-20.2-20.2c0-6.4,3-12.3,8-16.1l0-9.2C7,30.5,0.8,40.3,0.8,51.2 c0,15.5,12.6,28.2,28.2,28.2c9.1,0,17.6-4.4,22.9-11.7L48.1,57.6z";
        private static accessbilityPathPoints2 = "M69.3,59.9L69.3,59.9c-0.6-2.1-2.9-3.2-5-2.6l-1.9,0.6L55,38H30.1v-4.8h11.4c2.2,0,4-1.8,4-4s-1.8-4-4-4H30.1v-9.8 c3.1-0.9,5.2-3.7,5.2-7.1C35.3,4.3,32,1,27.9,1c-4.1,0-7.4,3.3-7.4,7.4c0,1.7,0.6,3.3,1.6,4.6v33h27.3l8.2,21.7l9-2.8 C68.8,64.2,69.9,62,69.3,59.9z";

        // calendar properties
        private static internalCalendarWidth = 80;
        private static calendarMarginRight = 18;
        private static calendarPathPoints1 = "M60.1,20.4c1.8,0,3.3-1.5,3.3-3.3V5.3c0-1.8-1.5-3.3-3.3-3.3c-1.8,0-3.3,1.5-3.3,3.3v11.8C56.8,18.9,58.3,20.4,60.1,20.4z";
        private static calendarPathPoints2 = "M20.5,20.4c1.8,0,3.3-1.5,3.3-3.3V5.3c0-1.8-1.5-3.3-3.3-3.3c-1.8,0-3.3,1.5-3.3,3.3v11.8C17.2,18.9,18.7,20.4,20.5,20.4z";
        private static calendarPathPoints3 = "M66.7,8.1v3.5c0,1.8,0,3,0,4.9c0,3.6-3,6.6-6.6,6.6c-3.6,0-6.6-3-6.6-6.6c0-2,0-3,0-4.9V8.1H27.2v3.5c0,2.1,0,3,0,4.9 c0,3.6-3,6.6-6.6,6.6c-3.6,0-6.6-3-6.6-6.6c0-2,0-2.9,0-4.9V8.1H1.5v70.2h77.1V8.1H66.7z M21.9,65.2h-7.9v-7.9h7.9V65.2z M21.9,54.6h-7.9v-7.9h7.9V54.6z M33,65.2h-7.9v-7.9H33V65.2z M33,54.6h-7.9v-7.9H33V54.6z M33,44h-7.9V36H33V44z M44.2,65.2h-7.9 v-7.9h7.9V65.2z M44.2,54.6h-7.9v-7.9h7.9V54.6z M44.2,44h-7.9V36h7.9V44z M55.3,65.2h-7.9v-7.9h7.9V65.2z M55.3,54.6h-7.9v-7.9 h7.9V54.6z M55.3,44h-7.9V36h7.9V44z M66.5,54.6h-7.9v-7.9h7.9V54.6z M66.5,44h-7.9V36h7.9V44z M66.5,30.4H13.9v-1.9h52.5V30.4z";

        private static internalSymbolHeight = 80.32;

        private static defaultValues = {
            visualSymbol: "star",
            value: 0,
            target: undefined,
            min: undefined,
            max: undefined,
            numStars: 5,
            showLabel: true,
            showStroke: false,
            showTargetLabel: true,
            showMinMaxLabels: true,
            minMaxColor: "#666666",
            targetColor: "#666666",

            // default star colors
            starStroke: "#FBB040",
            starFill: "#FBB040",
            emptyStarFill: "#E6E7E8",

            // dollar sign colors
            dollarSignStroke: "#65bb70",
            dollarSignFill: "#65bb70",

            // heart colors
            heartStroke: "#ed2024",
            heartFill: "#ed2024",

            // thumbs up colors
            thumbsUpStroke: "#FCD116",
            thumbsUpFill: "#FCD116",

            // smiley colors
            smileyStroke: "#FCD116",
            smileyFill: "#FCD116",

            // accessibility colors
            accessibilityStroke: "#3399ff",
            accessibilityFill: "#3399ff",

            // calendar colors
            calendarStroke: "#FBB040",
            calendarFill: "#FBB040"
        };

        private static starNumLimits = {
            min: 1,
            max: 100
        };

        private static properties = {
            visualSymbol:     { objectName: "starproperties", propertyName: "visualSymbol" },
            numStars:         { objectName: "starproperties", propertyName: "numStars" },
            showLabel:        { objectName: "starproperties", propertyName: "showLabel" },
            showStroke:       { objectName: "starproperties", propertyName: "showStroke" },
            showTargetLabel:  { objectName: "starproperties", propertyName: "showTargetLabel" },
            showMinMaxLabels: { objectName: "starproperties", propertyName: "showMinMaxLabels" },
            starStroke:       { objectName: "starcolors", propertyName: "starStroke" },
            starFill:         { objectName: "starcolors", propertyName: "starFill" },
            emptyStarFill:    { objectName: "starcolors", propertyName: "emptyStarFill" },
            targetColor:      { objectName: "starcolors", propertyName: "targetColor" },
            minMaxColor:      { objectName: "starcolors", propertyName: "minMaxColor" },
            min:              { objectName: "staraxis", propertyName: "min" },
            max:              { objectName: "staraxis", propertyName: "max" },
            target:           { objectName: "staraxis", propertyName: "target" },
        };

        private element: JQuery;
        private dataView: DataView;
        private data: StarsData;
        private options: VisualUpdateOptions;
        private labelWidth: number;
        private currentSymbolWidth: number;
        private currentSymbolMarginRight: number;
        private currentClipPath: string;

        private getTranslateXFromIndex(index: number): number {
            return (index * (this.currentSymbolWidth + this.currentSymbolMarginRight)) + this.labelWidth;
        }

        private getTargetTranslateX(target: number): number {
            let remainder = Number((target % 1).toFixed(2));
            let numFullStarsInTarget = target - remainder;

            // if target is whole number, center target line between stars
            if (remainder === 0) {
                return (numFullStarsInTarget * (this.currentSymbolWidth + this.currentSymbolMarginRight))
                        + (-this.currentSymbolMarginRight / 2)
                        + this.labelWidth;
            }
            else {
                return (numFullStarsInTarget * (this.currentSymbolWidth + this.currentSymbolMarginRight))
                        + (remainder * this.currentSymbolWidth)
                        + this.labelWidth;
            }
        }

        private setSymbolProps(symbol: string): void {
            switch (symbol) {
                case "star":
                    this.currentSymbolWidth = Stars.internalStarWidth;
                    this.currentSymbolMarginRight = Stars.starMarginRight;
                    this.currentClipPath = "#starClipPath";
                    break;

                case "dollarsign":
                    this.currentSymbolWidth = Stars.internalDollarSignWidth;
                    this.currentSymbolMarginRight = Stars.dollarSignMarginRight;
                    this.currentClipPath = "#dollarSignClipPath";
                    break;

                case "heart":
                    this.currentSymbolWidth = Stars.internalHeartWidth;
                    this.currentSymbolMarginRight = Stars.heartMarginRight;
                    this.currentClipPath = "#heartClipPath";
                    break;

                case "thumbsup":
                    this.currentSymbolWidth = Stars.internalThumbsupWidth;
                    this.currentSymbolMarginRight = Stars.thumbsupMarginRight;
                    this.currentClipPath = "#thumbsUpClipPath";
                    break;

                case "smiley":
                    this.currentSymbolWidth = Stars.internalSmileyWidth;
                    this.currentSymbolMarginRight = Stars.smileyMarginRight;
                    this.currentClipPath = "#smileyClipPath";
                    break;

                case "accessibility":
                    this.currentSymbolWidth = Stars.internalAccessbilityWidth;
                    this.currentSymbolMarginRight = Stars.accessbilityMarginRight;
                    this.currentClipPath = "#accesssibilityClipPath";
                    break;

                case "calendar":
                    this.currentSymbolWidth = Stars.internalCalendarWidth;
                    this.currentSymbolMarginRight = Stars.calendarMarginRight;
                    this.currentClipPath = "#calendarClipPath";
                    break;

                default:
                    this.currentSymbolWidth = Stars.internalStarWidth;
                    this.currentSymbolMarginRight = Stars.starMarginRight;
                    this.currentClipPath = "#starClipPath";
            }
        }

        private addStar(percentFull: number, index: number, svg: d3.Selection<SVGElement>, strokeOnly?: boolean, translateXOveride?: number): void {
            let fill = percentFull === 0 ? this.data.emptyStarFill : this.data.starFill,
                strokeWidth = this.data.showStroke ? 2 : 0,
                translateX = translateXOveride !== undefined ? 0 : this.getTranslateXFromIndex(index);

            fill = strokeOnly ? "none" : fill;

            svg.append("polygon")
                .attr("stroke", this.data.starStroke)
                .attr("stroke-width", strokeWidth)
                .attr("fill", fill)
                .attr("points", Stars.starPolygonPoints)
                .attr("transform", "translate(" + translateX + ")");
        }

        private addDollarSign(percentFull: number, index: number, svg: d3.Selection<SVGElement>, strokeOnly?: boolean, translateXOveride?: number): void {
            let fill = percentFull === 0 ? this.data.emptyStarFill : this.data.starFill,
                strokeWidth = this.data.showStroke ? 2 : 0,
                translateX = translateXOveride !== undefined ? 0 : this.getTranslateXFromIndex(index);

            fill = strokeOnly ? "none" : fill;

            svg.append("path")
                .attr("stroke", this.data.starStroke)
                .attr("stroke-width", strokeWidth)
                .attr("fill", fill)
                .attr("d", Stars.dollarSignPathPoints)
                .attr("transform", "translate(" + translateX + ")");
        }

        private addHeart(percentFull: number, index: number, svg: d3.Selection<SVGElement>, strokeOnly?: boolean, translateXOveride?: number): void {
            let fill = percentFull === 0 ? this.data.emptyStarFill : this.data.starFill,
                strokeWidth = this.data.showStroke ? 2 : 0,
                translateX = translateXOveride !== undefined ? 0 : this.getTranslateXFromIndex(index);

            fill = strokeOnly ? "none" : fill;

            svg.append("path")
                .attr("stroke", this.data.starStroke)
                .attr("stroke-width", strokeWidth)
                .attr("fill", fill)
                .attr("d", Stars.heartPathPoints)
                .attr("transform", "translate(" + translateX + ")");
        }

        private addThumbsup(percentFull: number, index: number, svg: d3.Selection<SVGElement>, strokeOnly?: boolean, translateXOveride?: number): void {
            let fill = percentFull === 0 ? this.data.emptyStarFill : this.data.starFill,
                strokeWidth = this.data.showStroke ? 2 : 0,
                translateX = translateXOveride !== undefined ? 0 : this.getTranslateXFromIndex(index);

            fill = strokeOnly ? "none" : fill;

            svg.append("path")
                .attr("stroke", this.data.starStroke)
                .attr("stroke-width", strokeWidth)
                .attr("fill", fill)
                .attr("d", Stars.thumbsupPathPoints)
                .attr("transform", "translate(" + translateX + ")");
        }

        private addSmiley(percentFull: number, index: number, svg: d3.Selection<SVGElement>, strokeOnly?: boolean, translateXOveride?: number): void {
            let fill = percentFull === 0 ? this.data.emptyStarFill : this.data.starFill,
                strokeWidth = this.data.showStroke ? 2 : 0,
                translateX = translateXOveride !== undefined ? 0 : this.getTranslateXFromIndex(index);

            fill = strokeOnly ? "none" : fill;

            svg.append("path")
                .attr("stroke", this.data.starStroke)
                .attr("stroke-width", strokeWidth)
                .attr("fill", fill)
                .attr("d", Stars.smileyPathPoints)
                .attr("transform", "translate(" + translateX + ")");
        }

        private addAccessibility(percentFull: number, index: number, svg: d3.Selection<SVGElement>, strokeOnly?: boolean, translateXOveride?: number): void {
            let fill = percentFull === 0 ? this.data.emptyStarFill : this.data.starFill,
                strokeWidth = this.data.showStroke ? 2 : 0,
                translateX = translateXOveride !== undefined ? 0 : this.getTranslateXFromIndex(index);

            fill = strokeOnly ? "none" : fill;

            svg.append("path")
                .attr("stroke", this.data.starStroke)
                .attr("stroke-width", strokeWidth)
                .attr("fill", fill)
                .attr("d", Stars.accessbilityPathPoints1)
                .attr("transform", "translate(" + translateX + ")");

            svg.append("path")
                .attr("stroke", this.data.starStroke)
                .attr("stroke-width", strokeWidth)
                .attr("fill", fill)
                .attr("d", Stars.accessbilityPathPoints2)
                .attr("transform", "translate(" + translateX + ")");
        }

        private addCalendar(percentFull: number, index: number, svg: d3.Selection<SVGElement>, strokeOnly?: boolean, translateXOveride?: number): void {
            let fill = percentFull === 0 ? this.data.emptyStarFill : this.data.starFill,
                strokeWidth = this.data.showStroke ? 2 : 0,
                translateX = translateXOveride !== undefined ? 0 : this.getTranslateXFromIndex(index);

            fill = strokeOnly ? "none" : fill;

            svg.append("path")
                .attr("stroke", this.data.starStroke)
                .attr("stroke-width", strokeWidth)
                .attr("fill", fill)
                .attr("d", Stars.calendarPathPoints1)
                .attr("transform", "translate(" + translateX + ")");

            svg.append("path")
                .attr("stroke", this.data.starStroke)
                .attr("stroke-width", strokeWidth)
                .attr("fill", fill)
                .attr("d", Stars.calendarPathPoints2)
                .attr("transform", "translate(" + translateX + ")");

            svg.append("path")
                .attr("stroke", this.data.starStroke)
                .attr("stroke-width", strokeWidth)
                .attr("fill", fill)
                .attr("d", Stars.calendarPathPoints3)
                .attr("transform", "translate(" + translateX + ")");
        }

        private addSymbol(percentFull: number, index: number, svg: d3.Selection<SVGElement>, strokeOnly?: boolean, translateXOveride?: number): void {
           switch (this.data.visualSymbol) {
                case "star":
                    this.addStar(percentFull, index, svg, strokeOnly, translateXOveride);
                    break;

                case "dollarsign":
                    this.addDollarSign(percentFull, index, svg, strokeOnly, translateXOveride);
                    break;

                case "heart":
                    this.addHeart(percentFull, index, svg, strokeOnly, translateXOveride);
                    break;

                case "thumbsup":
                    this.addThumbsup(percentFull, index, svg, strokeOnly, translateXOveride);
                    break;

                case "smiley":
                    this.addSmiley(percentFull, index, svg, strokeOnly, translateXOveride);
                    break;

                case "accessibility":
                    this.addAccessibility(percentFull, index, svg, strokeOnly, translateXOveride);
                    break;

                case "calendar":
                    this.addCalendar(percentFull, index, svg, strokeOnly, translateXOveride);
                    break;

                default:
                    this.addStar(percentFull, index, svg, strokeOnly, translateXOveride);
            }
        }

        private addLabel(svg: d3.Selection<SVGElement>): void {
            // let textValue = Stars.starLabelFormater.format(this.data.value),
            let text = svg.append("text")
                        .attr("stroke", this.data.starFill)
                        .attr("fill", this.data.starFill)
                        .attr("font-family", "wf_segoe-ui_normal, Arial, sans-serif")
                        .attr("font-size", (Stars.internalSymbolHeight / 2) + "px")
                        .text(this.data.valueLabel)
                        .attr("transform", "translate(0," + ((Stars.internalSymbolHeight * 2) / 3) + ")");

            // let paddingRight = (0.025 * this.options.viewport.width) <= 20 ? (0.028 * this.options.viewport.width) : 20;
            let paddingRight = 16;
            this.labelWidth = (text.node() as any).getBBox().width + paddingRight;
        }

        private addClipPathDefs(defs: d3.Selection<SVGElement>): void {
             defs.append("svg:clipPath")
                .attr("id", "starClipPath")
                .append("polygon")
                    .attr("points", Stars.starPolygonPoints);

            defs.append("svg:clipPath")
                .attr("id", "dollarSignClipPath")
                .append("path")
                    .attr("d", Stars.dollarSignPathPoints);

            defs.append("svg:clipPath")
                .attr("id", "heartClipPath")
                .append("path")
                    .attr("d", Stars.heartPathPoints);

            defs.append("svg:clipPath")
                .attr("id", "thumbsUpClipPath")
                .append("path")
                    .attr("d", Stars.thumbsupPathPoints);

            defs.append("svg:clipPath")
                .attr("id", "smileyClipPath")
                .append("path")
                    .attr("d", Stars.smileyPathPoints);

            let accessbilityClipPath = defs.append("svg:clipPath")
                .attr("id", "accesssibilityClipPath");

            accessbilityClipPath.append("path")
                .attr("d", Stars.accessbilityPathPoints1);

            accessbilityClipPath.append("path")
                .attr("d", Stars.accessbilityPathPoints2);

            let calendaryClipPath = defs.append("svg:clipPath")
                .attr("id", "calendarClipPath");

            calendaryClipPath.append("path")
                .attr("d", Stars.calendarPathPoints1);

            calendaryClipPath.append("path")
                .attr("d", Stars.calendarPathPoints2);

            calendaryClipPath.append("path")
                .attr("d", Stars.calendarPathPoints3);

        }

        private redraw(): void {
            this.element.empty();
            this.setSymbolProps(this.data.visualSymbol);

            let svg = d3.select(this.element.get(0)).append("svg")
                .attr("width", this.options.viewport.width)
                .attr("height", this.options.viewport.height);

            let viewBoxHeight = Stars.internalSymbolHeight;
            let starsAndLabelOffsetY = 0;
            if ((this.data.min !== undefined || this.data.max !== undefined) && this.data.showMinMaxLabels) {
                viewBoxHeight += 24;
            }
            if (this.data.target !== undefined) {
                if (this.data.showTargetLabel) {
                    viewBoxHeight += 32;
                    starsAndLabelOffsetY += 28;
                }
                else {
                    viewBoxHeight += 8;
                    starsAndLabelOffsetY += 4;
                }
            }

            let starsAndLabelGroup = svg.append("g").attr("transform", "translate(0," + starsAndLabelOffsetY + ")");
            let defs = svg.append("defs");
            this.addClipPathDefs(defs);

            if (this.data.showLabel) {
                this.addLabel(starsAndLabelGroup);
            }

            // wait till after we determine label width before setting viewbox
            svg.attr("viewBox", "0 0 " + this.getTranslateXFromIndex(this.data.numStars) + " " + viewBoxHeight);

            // draw min and max
            if ((this.data.min !== undefined || this.data.max !== undefined) && this.data.showMinMaxLabels) {
                // min
                let minLabel = svg.append("text")
                    .attr("stroke", this.data.minMaxColor)
                    .attr("fill", this.data.minMaxColor)
                    .attr("font-family", "wf_segoe-ui_normal, Arial, sans-serif")
                    .attr("font-size", "24px")
                    .text(this.data.minLabel);

                // center text over line
                let minLabelWidth = (minLabel.node() as any).getBBox().width;
                let minLabelX = this.getTargetTranslateX(0) + 2;
                minLabel.attr("transform", "translate(" + minLabelX + ", " + (viewBoxHeight - 2) + " )");

                // max
                let maxLabel = svg.append("text")
                    .attr("stroke", this.data.minMaxColor)
                    .attr("fill", this.data.minMaxColor)
                    .attr("font-family", "wf_segoe-ui_normal, Arial, sans-serif")
                    .attr("font-size", "24px")
                    .text(this.data.maxLabel);

                // center text over line
                let maxLabelWidth = (maxLabel.node() as any).getBBox().width;
                let maxLabelX = this.getTargetTranslateX(this.data.numStars - 1) + this.currentSymbolWidth - maxLabelWidth;
                maxLabel.attr("transform", "translate(" + maxLabelX + ", " + (viewBoxHeight - 2) + " )");
            }

            // draw symbols
            for (let i = 0; i < this.data.numStars; i++) {
                let percentFull = 0;

                if ((i + 1) <= this.data.value) {
                    percentFull = 1;
                }
                else if ((i + 1) - this.data.value < 1) {
                    percentFull = this.data.value - Math.floor(this.data.value);
                }

                // if percent is full or empty, we draw one star
                if (percentFull === 1 || percentFull === 0) {
                    this.addSymbol(percentFull, i, starsAndLabelGroup);
                }
                else {
                    // for a partial star we draw a full star and then cover up a part of it with a rectangle on top. 
                    // the rectangle is placed in a group that has a clipping mask to the shape of the star
                    // we then add an empty star on top of that so that the star stroke can still be seen 
                    let partialStarGroup = starsAndLabelGroup.append("g")
                        .attr("clip-path", "url(" + window.location.href + this.currentClipPath + ")")
                        .attr("transform", "translate(" + this.getTranslateXFromIndex(i) + ")");

                    // add base star to clipping path group to insure that it doesn"t show from underneath the rect
                    // index of 0 so that
                    this.addSymbol(1, 0, partialStarGroup, false, 0);

                    let rectWidth = ((1 - percentFull) * this.currentSymbolWidth);
                    partialStarGroup.append("rect")
                        .attr("height", Stars.internalSymbolHeight)
                        .attr("width", rectWidth)
                        .attr("fill", this.data.emptyStarFill)
                        .attr("transform", "translate(" + (this.currentSymbolWidth - rectWidth) + ")");

                    if (this.data.showStroke) {
                        this.addSymbol(1, i, starsAndLabelGroup, true);
                    }
                }
            }

            // draw target line
            if (this.data.target) {
                let targetGroup = svg.append("g")
                    .attr("class", "target-line-group")
                    .attr("transform", "translate(" + this.getTargetTranslateX(this.data.target) + ")");
                let targetLineOffsetY = 0;

                if (this.data.showTargetLabel) {
                    let targetLabel = targetGroup.append("text")
                    .attr("stroke", this.data.targetColor)
                    .attr("fill", this.data.targetColor)
                    .attr("font-family", "wf_segoe-ui_normal, Arial, sans-serif")
                    .attr("font-size", "24px")
                    .text(this.data.targetLabel);

                    // center text over line
                    let targetLabelWidth = (targetLabel.node() as any).getBBox().width;
                    targetLabel.attr("transform", "translate(" + (-targetLabelWidth / 2) + ", 18)");

                    targetLineOffsetY = 24;
                }

                targetGroup.append("rect")
                    .attr("fill", this.data.targetColor)
                    .attr("transform", "translate(-1," + targetLineOffsetY + ")")
                    .attr("width", "2")
                    .attr("height", Stars.internalSymbolHeight + 8);
            }
        }

        public static getFormatSymbol(format: string): string {
            let symbolPatterns: string[] = [
                "[$]",      // dollar sign
                "[€]",      // euro sign
                "[£]",      // british pound sign
                "[¥]",      // yen / yuan sign
                "[₩]",      // korean won sign
                "[%]",      // percent sign
            ];

            let symbolMatcher = new RegExp(symbolPatterns.join("|"), "g");
            let symbols = [];
            let match = symbolMatcher.exec(format);

            if (!match) {
                return undefined;
            }
            else {
                return match[0];
            }
        }

        // Convert a DataView into a view model
        public static converter(dataView: DataView): StarsData {
            let data = <StarsData> {};
            let valueFormatSymbol = "";
            let minFormatSymbol = "";
            let maxFormatSymbol = "";
            let targetFormatSymbol = "";

            if (dataView && dataView.categorical && dataView.categorical.values && dataView.metadata && dataView.metadata.columns) {
                dataView.categorical.values.forEach((val) => {
                    if (val.source.roles["value"]) {
                        data.value = val.values[0];
                        valueFormatSymbol = this.getFormatSymbol(val.source.format);
                    }
                    else if (val.source.roles["min"]) {
                        data.min = val.values[0];
                        minFormatSymbol = this.getFormatSymbol(val.source.format);
                    }
                    else if (val.source.roles["max"]) {
                        data.max = val.values[0];
                        maxFormatSymbol = this.getFormatSymbol(val.source.format);
                    }
                    else if (val.source.roles["target"]) {
                        data.target = val.values[0];
                        targetFormatSymbol = this.getFormatSymbol(val.source.format);
                    }
                });
            }
            else {
                data.value = Stars.defaultValues.value;
                data.min = undefined;
                data.max = undefined;
                data.target = undefined;
            }

            // if min, max, or target are not defined, check to see if they are set in formatting pane
            if (!data.min) {
                data.min = Stars.getFormattingPaneMin(dataView);
            }
            if (!data.max) {
                data.max = Stars.getFormattingPaneMax(dataView);
            }
            if (!data.target) {
                data.target = Stars.getFormattingPaneTarget(dataView);
            }

            data.numStars = Stars.getNumStars(dataView);
            data.showLabel = Stars.getShowLabel(dataView);
            data.showStroke = Stars.getShowStroke(dataView);
            data.showTargetLabel = Stars.getShowTargetLabel(dataView);
            data.showMinMaxLabels = Stars.getShowMinMaxLabels(dataView);
            data.starStroke = Stars.getStarStroke(dataView).solid.color;
            data.starFill = Stars.getStarFill(dataView).solid.color;
            data.emptyStarFill = Stars.getEmptyStarFill(dataView).solid.color;
            data.targetColor = Stars.getTargetColor(dataView).solid.color;
            data.minMaxColor = Stars.getMinMaxColor(dataView).solid.color;

            data.visualSymbol = Stars.getVisualSymbol(dataView);
            data.valueAsPercent = valueFormatSymbol === "%" ? true : false;
            data.valueWithSymbol = valueFormatSymbol && !data.valueAsPercent ? true : false;

            let min = data.min || 0;
            let max = data.max || data.numStars;

            if (data.valueAsPercent) {
                max = data.max || 1;

                data.valueLabel = (data.value * 100)  + "%";
                data.minLabel = (min * 100)  + "%";
                data.maxLabel = (max * 100)  + "%";
                data.targetLabel = (data.target * 100)  + "%";
            }
            else if (data.valueWithSymbol) {
                data.valueSymbol = valueFormatSymbol;
                data.valueLabel = data.valueSymbol + data.value;
                data.targetLabel = data.valueSymbol + data.target;
                data.minLabel = String(min);
                data.maxLabel = String(max);
            }
            else {
                data.value = Number(data.value.toFixed(1));
                data.valueLabel = String(data.value);

                data.minLabel = String(min);
                data.maxLabel = String(max);

                if (data.target) {
                    data.target = Number(data.target.toFixed(1));
                    data.targetLabel = String(data.target);
                }
            }

            let rangeSize = max - min;
            let scale = data.numStars / rangeSize;

            data.value = (data.value * scale) - (min * scale);

            if (data.target) {
                data.target = (data.target * scale) - (min * scale);
            }

            return data;
        }

        /* One time setup*/
        constructor(options: VisualConstructorOptions) {
            this.element = $(options.element);
        }

        /* Called for data, size, formatting changes*/
        public update(options: VisualUpdateOptions) {
            let dataView = this.dataView = options.dataViews[0];

            if (dataView) {
                this.data = Stars.converter(dataView);
                this.options = options;
                this.labelWidth = 0; // reset to 0, will get update when/if label is added
                this.redraw();
            }
        }

        /*About to remove your visual, do clean up here */
        public destroy() {
            this.element.empty();

            this.data = null;
            this.options = null;
            this.labelWidth = null;
            this.element = null;
            this.dataView = null;
        }

        private static getDefaultColors(visualSymbol: string): ISymbolColorConfig {

            let defaultColorConfig = {} as ISymbolColorConfig;

            switch (visualSymbol) {
                case "star":
                    defaultColorConfig.fill = Stars.defaultValues.starFill;
                    defaultColorConfig.stroke = Stars.defaultValues.starStroke;
                    break;

                case "dollarsign":
                    defaultColorConfig.fill = Stars.defaultValues.dollarSignFill;
                    defaultColorConfig.stroke = Stars.defaultValues.dollarSignStroke;
                    break;

                case "heart":
                    defaultColorConfig.fill = Stars.defaultValues.heartFill;
                    defaultColorConfig.stroke = Stars.defaultValues.heartStroke;
                    break;

                case "thumbsup":
                    defaultColorConfig.fill = Stars.defaultValues.thumbsUpFill;
                    defaultColorConfig.stroke = Stars.defaultValues.thumbsUpStroke;
                    break;

                case "smiley":
                    defaultColorConfig.fill = Stars.defaultValues.smileyFill;
                    defaultColorConfig.stroke = Stars.defaultValues.smileyStroke;
                    break;

                case "accessibility":
                    defaultColorConfig.fill = Stars.defaultValues.accessibilityFill;
                    defaultColorConfig.stroke = Stars.defaultValues.accessibilityStroke;
                    break;

                case "calendar":
                    defaultColorConfig.fill = Stars.defaultValues.calendarFill;
                    defaultColorConfig.stroke = Stars.defaultValues.calendarStroke;
                    break;

                default:
                    defaultColorConfig.fill = Stars.defaultValues.starFill;
                    defaultColorConfig.stroke = Stars.defaultValues.starStroke;
                    break;
            }

            return defaultColorConfig;
        }

        private static getValue<T>(objects: DataViewObjects, property: any, defaultValue?: T): T {
            if (!objects || !objects[property.objectName]) {
                return defaultValue;
            }

            let objectOrMap = objects[property.objectName];
            let object = <DataViewObject>objectOrMap;
            let propertyValue = <T>object[property.propertyName];

            if (propertyValue === undefined) {
                return defaultValue;
            }

            return propertyValue;
        }

        private static getVisualSymbol(dataView: DataView): string {
            let visualSymbol = dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.visualSymbol, Stars.defaultValues.visualSymbol);
            return visualSymbol;
        }

        private static getNumStars(dataView: DataView): number {
            let numStars = dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.numStars, Stars.defaultValues.numStars);

            if (numStars < Stars.starNumLimits.min) {
                numStars = Stars.starNumLimits.min;
            }
            else if (numStars > Stars.starNumLimits.max) {
                numStars = Stars.starNumLimits.max;
            }

            return numStars;
        }

        private static getFormattingPaneMin(dataView: DataView): number {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.min, undefined);
        }

        private static getFormattingPaneMax(dataView: DataView): number {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.max, undefined);
        }

        private static getFormattingPaneTarget(dataView: DataView): number {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.target, undefined);
        }

        private static getShowLabel(dataView: DataView): boolean {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.showLabel, Stars.defaultValues.showLabel);
        }

        private static getShowTargetLabel(dataView: DataView): boolean {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.showTargetLabel, Stars.defaultValues.showTargetLabel);
        }

        private static getShowMinMaxLabels(dataView: DataView): boolean {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.showMinMaxLabels, Stars.defaultValues.showMinMaxLabels);
        }

        private static getShowStroke(dataView: DataView): boolean {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.showStroke, Stars.defaultValues.showStroke);
        }

        private static getStarStroke(dataView: DataView): Fill {
            let visualSymbol = Stars.getVisualSymbol(dataView);
            let defaultColorConfig = Stars.getDefaultColors(visualSymbol);
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.starStroke, { solid: { color: defaultColorConfig.stroke } });
        }

        private static getStarFill(dataView: DataView): Fill {
            let visualSymbol = Stars.getVisualSymbol(dataView);
            let defaultColorConfig = Stars.getDefaultColors(visualSymbol);
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.starFill, { solid: { color: defaultColorConfig.fill } });
        }

        private static getEmptyStarFill(dataView: DataView): Fill {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.emptyStarFill, { solid: { color: Stars.defaultValues.emptyStarFill } });
        }

        private static getTargetColor(dataView: DataView): Fill {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.targetColor, { solid: { color: Stars.defaultValues.targetColor } });
        }

        private static getMinMaxColor(dataView: DataView): Fill {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.minMaxColor, { solid: { color: Stars.defaultValues.minMaxColor } });
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            let instances: VisualObjectInstance[] = [];
            switch (options.objectName) {
                case "starproperties":
                    let starProperties: VisualObjectInstance = {
                        objectName: "starproperties",
                        displayName: "Star Properties",
                        selector: null,
                        properties: {
                            visualSymbol: Stars.getVisualSymbol(this.dataView),
                            numStars: Stars.getNumStars(this.dataView),
                            showLabel: Stars.getShowLabel(this.dataView),
                            showStroke: Stars.getShowStroke(this.dataView),
                            showTargetLabel: Stars.getShowTargetLabel(this.dataView),
                            showMinMaxLabels: Stars.getShowMinMaxLabels(this.dataView)
                        }
                    };
                    instances.push(starProperties);
                    break;
                case "starcolors":
                    let starColors: VisualObjectInstance = {
                        objectName: "starcolors",
                        displayName: "Star Colors",
                        selector: null,
                        properties: {
                            starStroke: Stars.getStarStroke(this.dataView),
                            starFill: Stars.getStarFill(this.dataView),
                            emptyStarFill: Stars.getEmptyStarFill(this.dataView),
                            targetColor: Stars.getTargetColor(this.dataView),
                            minMaxColor: Stars.getMinMaxColor(this.dataView)
                        }
                    };
                    instances.push(starColors);
                    break;
                case "staraxis":
                    let staraxis: VisualObjectInstance = {
                        objectName: "staraxis",
                        displayName: "Star Axis",
                        selector: null,
                        properties: {
                            min: Stars.getFormattingPaneMin(this.dataView),
                            max: Stars.getFormattingPaneMax(this.dataView),
                            target: Stars.getFormattingPaneTarget(this.dataView)
                        }
                    };
                    instances.push(staraxis);
                    break;
            }
            return instances;
        }
    }
}