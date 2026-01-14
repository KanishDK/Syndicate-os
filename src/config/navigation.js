export const NAVIGATION_TABS = [
    {
        id: 'sultan',
        icon: 'fa-comment-dots',
        labelKey: 'tabs.sultan',
        color: 'text-theme-warning'
    },
    {
        id: 'production',
        icon: 'fa-flask',
        labelKey: 'tabs.production',
        color: 'text-theme-success'
    },
    {
        id: 'network',
        icon: 'fa-globe',
        labelKey: 'tabs.network',
        color: 'text-theme-info',
        showCount: true // For desktop generic count: "X / Y"
    },
    {
        id: 'rivals',
        icon: 'fa-skull-crossbones',
        labelKey: 'tabs.rivals',
        color: 'text-theme-danger'
    },
    {
        id: 'finance',
        icon: 'fa-sack-dollar',
        labelKey: 'tabs.finance',
        color: 'text-theme-warning',
        alertCheck: (state) => (state.dirtyCash || 0) > 5000 // Dynamic check function
    },
    {
        id: 'management',
        icon: 'fa-briefcase',
        labelKey: 'tabs.management',
        color: 'text-theme-info'
    },
    {
        id: 'empire',
        icon: 'fa-crown',
        labelKey: 'tabs.empire',
        color: 'text-theme-primary'
    }
];
