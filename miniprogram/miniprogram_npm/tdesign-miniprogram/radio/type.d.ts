export interface TdRadioProps {
    align?: {
        type: StringConstructor;
        value?: 'left' | 'right';
    };
    allowUncheck?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    checked?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    defaultChecked?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    color?: {
        type: StringConstructor;
        value?: string;
    };
    content?: {
        type: StringConstructor;
        value?: string;
    };
    contentDisabled?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    disabled?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    externalClasses?: {
        type: ArrayConstructor;
        value?: ['t-class', 't-class-icon', 't-class-label', 't-class-content', 't-class-border'];
    };
    icon?: {
        type: StringConstructor;
        optionalTypes: Array<ArrayConstructor>;
        value?: 'fill-circle' | 'stroke-line' | Array<string>;
    };
    label?: {
        type: StringConstructor;
        value?: string;
    };
    maxContentRow?: {
        type: NumberConstructor;
        value?: number;
    };
    maxLabelRow?: {
        type: NumberConstructor;
        value?: number;
    };
    name?: {
        type: StringConstructor;
        value?: string;
    };
    value?: {
        type: StringConstructor;
        optionalTypes: Array<NumberConstructor | BooleanConstructor>;
        value?: RadioValue;
    };
}
export interface TdRadioGroupProps {
    disabled?: {
        type: BooleanConstructor;
        value?: boolean;
    };
    name?: {
        type: StringConstructor;
        value?: string;
    };
    options?: {
        type: ArrayConstructor;
        value?: Array<RadioOption>;
    };
    value?: {
        type: StringConstructor;
        optionalTypes: Array<NumberConstructor | BooleanConstructor>;
        value?: RadioValue;
    };
    defaultValue?: {
        type: StringConstructor;
        optionalTypes: Array<NumberConstructor | BooleanConstructor>;
        value?: RadioValue;
    };
}
export declare type RadioValue = string | number | boolean;
export declare type RadioOption = string | number | RadioOptionObj;
export interface RadioOptionObj {
    label?: string;
    value?: string | number;
    disabled?: boolean;
}
