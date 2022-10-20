import { SuperComponent, RelationsOptions } from '../common/src/index';
export default class Tabbar extends SuperComponent {
    relations: RelationsOptions;
    externalClasses: string[];
    backupValue: 0;
    data: {
        prefix: string;
        classPrefix: string;
    };
    properties: import("./type").TdTabBarProps;
    controlledProps: {
        key: string;
        event: string;
    }[];
    observers: {
        value(): void;
    };
    ready(): void;
    methods: {
        showChildren(): void;
        updateChildren(): void;
        updateValue(value: any): void;
        changeOtherSpread(value: any): void;
        initName(): any;
    };
}
