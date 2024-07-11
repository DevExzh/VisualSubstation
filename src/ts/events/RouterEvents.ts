export class RouteSwitchEvent extends Event {
    public readonly data: any;
    public readonly routeName: string;
    constructor(route: string, data?: any) {
        super('route-switch');
        this.data = data;
        this.routeName = route;
    }
}