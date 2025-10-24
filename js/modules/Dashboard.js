export class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.widgets = new Map();
    }

    addWidget(WidgetClass, config = {}) {
        try {
            const widget = new WidgetClass(config);
            const widgetElement = widget.render();
            
            this.container.appendChild(widgetElement);
            this.widgets.set(widget.id, widget);
            
            return widget;
        } catch (error) {
            console.error('Ошибка при добавлении виджета:', error);
            return null;
        }
    }

    removeWidget(widgetId) {
        const widget = this.widgets.get(widgetId);
        if (widget) {
            widget.destroy();
            this.widgets.delete(widgetId);
        }
    }

    getWidget(widgetId) {
        return this.widgets.get(widgetId);
    }

    getAllWidgets() {
        return Array.from(this.widgets.values());
    }

    clear() {
        this.widgets.forEach(widget => widget.destroy());
        this.widgets.clear();
    }
}