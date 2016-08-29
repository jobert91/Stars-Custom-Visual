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
        valueLabel: string;
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
        target: number;
    };

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

        private static internalSymbolHeight = 80.32;

        private static defaultValues = {
            visualSymbol: "star",
            target: undefined,
            value: 0,
            numStars: 5,
            showLabel: true,
            showStroke: false,
            starStroke: "#FBB040",
            starFill: "#FBB040",
            emptyStarFill: "#E6E7E8"
        };

        private static starNumLimits = {
            min: 1,
            max: 100
        };

        private static properties = {
            visualSymbol:     { objectName: "starproperties", propertyName: "symbol" },
            numStars:         { objectName: "starproperties", propertyName: "numStars" },
            showLabel:        { objectName: "starproperties", propertyName: "showLabel" },
            showStroke:       { objectName: "starproperties", propertyName: "showStroke" },
            starStroke:       { objectName: "starproperties", propertyName: "starStroke" },
            starFill:         { objectName: "starproperties", propertyName: "starFill" },
            emptyStarFill:    { objectName: "starproperties", propertyName: "emptyStarFill" }
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
            let paddingRight = this.currentSymbolMarginRight * 2;
            this.labelWidth = (text.node() as any).getBBox().width + paddingRight;
        }

        private redraw(): void {
            this.element.empty();
            this.setSymbolProps(this.data.visualSymbol);

            let svg = d3.select(this.element.get(0)).append("svg")
                .attr("width", this.options.viewport.width)
                .attr("height", this.options.viewport.height);

            let defs = svg.append("defs");

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

            if (this.data.showLabel) {
                this.addLabel(svg);
            }

            // wait till after we determine label width before setting viewbox
            svg.attr("viewBox", "0 0 " + this.getTranslateXFromIndex(this.data.numStars) + " " + Stars.internalSymbolHeight);

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
                    this.addSymbol(percentFull, i, svg);
                }
                else {
                    // for a partial star we draw a full star and then cover up a part of it with a rectangle on top. 
                    // the rectangle is placed in a group that has a clipping mask to the shape of the star
                    // we then add an empty star on top of that so that the star stroke can still be seen 
                    let partialStarGroup = svg.append("g")
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
                        this.addStar(1, i, svg, true);
                    }
                }
            }

            if (this.data.target) {
                svg.append("g")
                    .attr("class", "target-line-group")
                    .attr("transform", "translate(" + this.getTranslateXFromIndex(this.data.target) + ")")
                    .append("rect")
                        .attr("fill", "#666666")
                        .attr("width", "2")
                        .attr("height", Stars.internalSymbolHeight);
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

            if (dataView && dataView.categorical && dataView.metadata && dataView.metadata.columns) {
                data.value = Number(dataView.categorical.values[0].values[0]);
                data.target = Number(dataView.categorical.values[1].values[0]);
            }
            else {
                data.value = Stars.defaultValues.value;
            }

            data.numStars = Stars.getNumStars(dataView);
            data.showLabel = Stars.getShowLabel(dataView);
            data.showStroke = Stars.getShowStroke(dataView);
            data.starStroke = Stars.getStarStroke(dataView).solid.color;
            data.starFill = Stars.getStarFill(dataView).solid.color;
            data.emptyStarFill = Stars.getEmptyStarFill(dataView).solid.color;
            data.visualSymbol = Stars.getVisualSymbol(dataView);

            let formatString = dataView.metadata.columns[0].format;
            let formatSymbol = this.getFormatSymbol(formatString);

            data.valueAsPercent = formatSymbol === "%" ? true : false;
            data.valueWithSymbol = formatSymbol && !data.valueAsPercent ? true : false;

            if (data.valueAsPercent) {
                data.valueLabel = (data.value * 100)  + "%";
                data.value = data.numStars * data.value;
            }
            else if (data.valueWithSymbol) {
                data.valueSymbol = formatSymbol;
                data.valueLabel = data.valueSymbol + data.value;
            }
            else {
                data.value = Number(data.value.toFixed(1));
                data.valueLabel = String(data.value);
            }

            return data;
        }

        /* One time setup*/
        constructor(options: VisualInitOptions) {
            this.element = $(options.element);
        }

        /* Called for data, size, formatting changes*/
        public update(options: VisualUpdateOptions) {
            // console.log("drawing star visual");
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

        private static getValue<T>(objects: DataViewObjects, property: any, defaultValue?: T): T {
            if (!objects) {
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

        private static getShowLabel(dataView: DataView): boolean {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.showLabel, Stars.defaultValues.showLabel);
        }

        private static getShowStroke(dataView: DataView): boolean {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.showStroke, Stars.defaultValues.showStroke);
        }

        private static getStarStroke(dataView: DataView): Fill {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.starStroke, { solid: { color: Stars.defaultValues.starStroke } });
        }

        private static getStarFill(dataView: DataView): Fill {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.starFill, { solid: { color: Stars.defaultValues.starFill } });
        }

        private static getEmptyStarFill(dataView: DataView): Fill {
            return dataView.metadata && Stars.getValue(dataView.metadata.objects, Stars.properties.emptyStarFill, { solid: { color: Stars.defaultValues.emptyStarFill } });
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            let instances: VisualObjectInstance[] = [];
            switch (options.objectName) {
                case "starproperties":
                    let general: VisualObjectInstance = {
                        objectName: "starproperties",
                        displayName: "Star Properties",
                        selector: null,
                        properties: {
                            visualSymbol: Stars.getVisualSymbol(this.dataView),
                            numStars: Stars.getNumStars(this.dataView),
                            showLabel: Stars.getShowLabel(this.dataView),
                            showStroke: Stars.getShowStroke(this.dataView),
                            starStroke: Stars.getStarStroke(this.dataView),
                            starFill: Stars.getStarFill(this.dataView),
                            emptyStarFill: Stars.getEmptyStarFill(this.dataView)
                        }
                    };
                    instances.push(general);
                    break;
            }
            return instances;
        }
    }
}