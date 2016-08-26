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
    };

    export class Stars implements IVisual {

        private static internalViewBoxStarWidth = 84.46; // 4 is the padding
        private static internalViewBoxStarHeight = 80.32;
        private static starMarginRight = 4;
        private static starPolygonPoints = "42.23 2.31 54.4 27.64 82.26 31.39 61.93 50.8 66.97 78.45 42.23 65.12 17.49 78.45 22.53 50.8 2.19 31.39 30.05 27.64 42.23 2.31";

        private static defaultValues = {
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
            numStars: { objectName: "general", propertyName: "numStars" },
            showLabel: { objectName: "general", propertyName: "showLabel" },
            showStroke: { objectName: "general", propertyName: "showStroke" },
            starStroke: { objectName: "general", propertyName: "starStroke" },
            starFill: { objectName: "general", propertyName: "starFill" },
            emptyStarFill: { objectName: "general", propertyName: "emptyStarFill" }
        };

        private element: JQuery;
        private dataView: DataView;
        private data: StarsData;
        private options: VisualUpdateOptions;
        private labelWidth: number;

        private getTranslateXFromIndex(index: number): number {
            return (index * (Stars.internalViewBoxStarWidth + Stars.starMarginRight)) + this.labelWidth;
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

        private addLabel(svg: d3.Selection<SVGElement>): void {
            // let textValue = Stars.starLabelFormater.format(this.data.value),
            let text = svg.append("text")
                        .attr("stroke", this.data.starFill)
                        .attr("fill", this.data.starFill)
                        .attr("font-family", "wf_segoe-ui_normal, Arial, sans-serif")
                        .attr("font-size", (Stars.internalViewBoxStarHeight / 2) + "px")
                        .text(this.data.valueLabel)
                        .attr("transform", "translate(0," + ((Stars.internalViewBoxStarHeight * 2) / 3) + ")");

            let paddingRight = (0.025 * this.options.viewport.width) <= 20 ? (0.028 * this.options.viewport.width) : 20;
            this.labelWidth = (text.node() as any).getBBox().width + paddingRight;
        }

        private redraw(): void {
            this.element.empty();

            let svg = d3.select(this.element.get(0)).append("svg")
                .attr("width", this.options.viewport.width)
                .attr("height", this.options.viewport.height);

            svg.append("defs").append("svg:clipPath")
                .attr("id", "starClipPath")
                .append("polygon")
                .attr("points", Stars.starPolygonPoints);

            if (this.data.showLabel) {
                this.addLabel(svg);
            }

            // wait till after we determine label width before setting viewbox
            svg.attr("viewBox", "0 0 " + this.getTranslateXFromIndex(this.data.numStars) + " " + Stars.internalViewBoxStarHeight);

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
                    this.addStar(percentFull, i, svg);
                }
                else {
                    // for a partial star we draw a full star and then cover up a part of it with a rectangle on top. 
                    // the rectangle is placed in a group that has a clipping mask to the shape of the star
                    // we then add an empty star on top of that so that the star stroke can still be seen 
                    let partialStarGroup = svg.append("g")
                        .attr("clip-path", "url(" + window.location.href + "#starClipPath)")
                        .attr("transform", "translate(" + this.getTranslateXFromIndex(i) + ")");

                    // add base star to clipping path group to insure that it doesn"t show from underneath the rect
                    // index of 0 so that
                    this.addStar(1, 0, partialStarGroup, false, 0);

                    let rectWidth = ((1 - percentFull) * Stars.internalViewBoxStarWidth);
                    partialStarGroup.append("rect")
                        .attr("height", Stars.internalViewBoxStarHeight)
                        .attr("width", rectWidth)
                        .attr("fill", this.data.emptyStarFill)
                        .attr("transform", "translate(" + (Stars.internalViewBoxStarWidth - rectWidth) + ")");

                    if (this.data.showStroke) {
                        this.addStar(1, i, svg, true);
                    }
                }
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

            if (dataView && dataView.categorical && dataView.categorical.values && dataView.metadata && dataView.metadata.columns) {
                data.value = Number(dataView.categorical.values[0].values[0]);
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
                case "general":
                    let general: VisualObjectInstance = {
                        objectName: "general",
                        displayName: "General",
                        selector: null,
                        properties: {
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