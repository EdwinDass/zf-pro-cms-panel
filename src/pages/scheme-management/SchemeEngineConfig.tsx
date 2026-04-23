import React, { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Divider, Switch, FormControlLabel, Tab, Tabs, Autocomplete, Chip } from "@mui/material";
import { Plus, Trash2, ChevronDown, ChevronRight, Copy, Code, Save, Settings2, Box as BoxIcon, Link2 } from "lucide-react";
import TopBar from "../../layouts/top-bar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearTokens } from "../../redux/slices/authTokenSlice";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { userLogout } from "../../services/ApiService";

type LogicalOperator = "AND" | "OR";
type ComparisonOperator = "EQUALS" | "IN" | "GT" | "LT";

type RuleCondition = { field: string; operator: ComparisonOperator; value: any };
type RuleGroup = { operator: LogicalOperator; conditions: Rule[] };
type Rule = RuleGroup | RuleCondition;

type ModifierType = "ADDITIVE" | "MULTIPLIER";

type SkuModifier = {
    min: number | string;
    max?: number | string;
    type: ModifierType;
    value: number | string;
};

type Slab = {
    id: string; // for React UI key tracking
    skuModifiers?: Record<string, SkuModifier>;
    defaultModifier?: SkuModifier;
    skuConditions?: Record<string, { min: number | string; max?: number | string }>; 
};

type SlabConfig = {
    type: "SCAN_COUNT" | "EARNED_POINTS";
    slabs: Slab[];
};

export type SchemePayload = {
    condition?: Rule;
    slabConfig: SlabConfig;
};

// Default structures
const defaultRuleGroup: RuleGroup = { operator: "AND", conditions: [] };
const defaultRuleCondition: RuleCondition = { field: "sku", operator: "EQUALS", value: "" };

const generateId = () => Math.random().toString(36).substring(2, 9);

function isGroup(rule: Rule): rule is RuleGroup {
    return (rule as RuleGroup).conditions !== undefined;
}

const ConditionNode: React.FC<{
    rule: Rule;
    path: number[];
    onChange: (path: number[], newRule: Rule) => void;
    onDelete: (path: number[]) => void;
}> = ({ rule, path, onChange, onDelete }) => {
    
    if (isGroup(rule)) {
        return (
            <Box className="ml-4 pl-4 border-l-2 border-indigo-200 mt-2 pb-2">
                <Box className="flex items-center gap-3 mb-3 bg-indigo-50/50 p-2 rounded-lg backdrop-blur-sm shadow-sm border border-indigo-100">
                    <Select
                        size="small"
                        value={rule.operator}
                        onChange={(e) => onChange(path, { ...rule, operator: e.target.value as LogicalOperator })}
                        className="bg-white min-w-[80px]"
                    >
                        <MenuItem value="AND">AND</MenuItem>
                        <MenuItem value="OR">OR</MenuItem>
                    </Select>
                    <Typography variant="body2" className="text-gray-500 font-medium">Group</Typography>
                    <Box className="flex-grow" />
                    <Button 
                        size="small" 
                        startIcon={<Plus size={16}/>} 
                        onClick={() => onChange(path, { ...rule, conditions: [...rule.conditions, defaultRuleCondition] })}
                        className="text-indigo-600"
                    >
                        Rule
                    </Button>
                    <Button 
                        size="small" 
                        startIcon={<Plus size={16}/>} 
                        onClick={() => onChange(path, { ...rule, conditions: [...rule.conditions, defaultRuleGroup] })}
                        className="text-indigo-600"
                    >
                        Group
                    </Button>
                    {path.length > 0 && (
                        <IconButton size="small" color="error" onClick={() => onDelete(path)}>
                            <Trash2 size={18} />
                        </IconButton>
                    )}
                </Box>
                
                {rule.conditions.map((childNode, index) => (
                    <ConditionNode
                        key={index}
                        rule={childNode}
                        path={[...path, index]}
                        onChange={onChange}
                        onDelete={onDelete}
                    />
                ))}
            </Box>
        );
    }

    return (
        <Box className="flex flex-wrap items-center gap-3 ml-4 mb-2 p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <FormControl size="small" className="min-w-[150px]">
                <InputLabel>Field</InputLabel>
                <Select
                    label="Field"
                    value={rule.field}
                    onChange={(e) => onChange(path, { ...rule, field: e.target.value })}
                >
                    <MenuItem value="sku">SKU</MenuItem>
                    <MenuItem value="pincode">Pincode</MenuItem>
                    <MenuItem value="userType">User Type</MenuItem>
                    <MenuItem value="scanCount">Scan Count</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" className="min-w-[120px]">
                <InputLabel>Operator</InputLabel>
                <Select
                    label="Operator"
                    value={rule.operator}
                    onChange={(e) => {
                        const op = e.target.value as ComparisonOperator;
                        onChange(path, { ...rule, operator: op, value: op === 'IN' ? '' : rule.value });
                    }}
                >
                    <MenuItem value="EQUALS">EQUALS</MenuItem>
                    <MenuItem value="IN">IN (comma sep)</MenuItem>
                    <MenuItem value="GT">GREATER THAN</MenuItem>
                    <MenuItem value="LT">LESS THAN</MenuItem>
                </Select>
            </FormControl>

            {rule.operator === "IN" ? (
                <TextField
                    size="small"
                    label="Values (comma separated)"
                    variant="outlined"
                    placeholder="e.g. SKU1, SKU2"
                    className="flex-grow min-w-[200px]"
                    value={Array.isArray(rule.value) ? rule.value.join(", ") : rule.value}
                    onChange={(e) => {
                        onChange(path, { ...rule, value: e.target.value });
                    }}
                />
            ) : (
                <TextField
                    size="small"
                    label="Value"
                    variant="outlined"
                    className="flex-grow min-w-[150px]"
                    value={rule.value}
                    onChange={(e) => onChange(path, { ...rule, value: e.target.value })}
                />
            )}

            <IconButton size="small" color="error" onClick={() => onDelete(path)}>
                <Trash2 size={18} />
            </IconButton>
        </Box>
    );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SlabDetailEditor: React.FC<{
    slab: Slab;
    onUpdate: (updated: Slab) => void;
}> = ({ slab, onUpdate }) => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleDefaultChange = (field: keyof SkuModifier, val: any) => {
        const currentMod = slab.defaultModifier || { min: 1, type: "ADDITIVE", value: 1 };
        onUpdate({ ...slab, defaultModifier: { ...currentMod, [field]: val } });
    };

    // SKU Modifiers
    const handleSkuModAdd = () => {
        const mods = { ...slab.skuModifiers };
        const key = `SKU_${generateId().toUpperCase()}`;
        mods[key] = { min: 1, type: "ADDITIVE", value: 1 };
        onUpdate({ ...slab, skuModifiers: mods });
    };
    const handleSkuModChange = (sku: string, field: string, val: any) => {
        const mods = { ...slab.skuModifiers };
        if (field === "key") {
            // rename key
            const oldMod = mods[sku];
            delete mods[sku];
            mods[val] = oldMod;
        } else {
            mods[sku] = { ...mods[sku] as SkuModifier, [field]: val };
        }
        onUpdate({ ...slab, skuModifiers: mods });
    };
    const handleSkuModDelete = (sku: string) => {
        const mods = { ...slab.skuModifiers };
        delete mods[sku];
        onUpdate({ ...slab, skuModifiers: Object.keys(mods).length === 0 ? undefined : mods });
    };

    // SKU Conditions
    const handleSkuCondAdd = () => {
        const conds = { ...slab.skuConditions };
        const key = `SKU_${generateId().toUpperCase()}`;
        conds[key] = { min: 1 };
        onUpdate({ ...slab, skuConditions: conds });
    };
    const handleSkuCondChange = (sku: string, field: string, val: any) => {
        const conds = { ...slab.skuConditions };
        if (field === "key") {
            const oldCond = conds[sku];
            delete conds[sku];
            conds[val] = oldCond;
        } else {
            conds[sku] = { ...conds[sku], [field]: val };
        }
        onUpdate({ ...slab, skuConditions: conds });
    };
    const handleSkuCondDelete = (sku: string) => {
        const conds = { ...slab.skuConditions };
        delete conds[sku];
        onUpdate({ ...slab, skuConditions: Object.keys(conds).length === 0 ? undefined : conds });
    };

    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} aria-label="slab tabs" TabIndicatorProps={{ className: "bg-teal-500" }}>
                    <Tab icon={<Settings2 size={16} />} iconPosition="start" label="Default Modifier" className={tabIndex === 0 ? "text-teal-600 font-semibold" : ""} />
                    <Tab icon={<BoxIcon size={16} />} iconPosition="start" label="SKU Modifiers" className={tabIndex === 1 ? "text-teal-600 font-semibold" : ""} />
                    <Tab icon={<Link2 size={16} />} iconPosition="start" label="SKU Conditions" className={tabIndex === 2 ? "text-teal-600 font-semibold" : ""} />
                </Tabs>
            </Box>
            
            {/* Tab 0: Default Modifier */}
            <CustomTabPanel value={tabIndex} index={0}>
                <Box className="p-4 border border-indigo-100 rounded-lg bg-indigo-50/20 flex flex-wrap gap-4 items-center">
                    <TextField 
                        size="small" label="Min Scope" type="number" 
                        value={slab.defaultModifier?.min ?? ''}
                        onChange={(e) => handleDefaultChange("min", e.target.value === '' ? undefined : e.target.value)}
                    />
                    <TextField 
                        size="small" label="Max Scope (Optional)" type="number" 
                        value={slab.defaultModifier?.max ?? ''}
                        onChange={(e) => handleDefaultChange("max", e.target.value === '' ? undefined : e.target.value)}
                    />
                    <FormControl size="small" className="min-w-[120px]">
                        <InputLabel>Type</InputLabel>
                        <Select
                            label="Type"
                            value={slab.defaultModifier?.type || "ADDITIVE"}
                            onChange={(e) => handleDefaultChange("type", e.target.value as ModifierType)}
                        >
                            <MenuItem value="ADDITIVE">Additive (+)</MenuItem>
                            <MenuItem value="MULTIPLIER">Multiplier (x)</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField 
                        size="small" label="Points Value" type="number" 
                        value={slab.defaultModifier?.value ?? ''}
                        onChange={(e) => handleDefaultChange("value", e.target.value === '' ? undefined : e.target.value)}
                    />
                </Box>
            </CustomTabPanel>

            {/* Tab 1: SKU Modifiers */}
            <CustomTabPanel value={tabIndex} index={1}>
                <Box className="space-y-3">
                    {slab.skuModifiers && Object.entries(slab.skuModifiers).map(([sku, mod]) => (
                         <Box key={sku} className="flex gap-3 items-center p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                             <TextField 
                                size="small" label="SKU Key" 
                                defaultValue={sku}
                                onBlur={(e) => handleSkuModChange(sku, "key", e.target.value)}
                                className="w-40"
                             />
                             <TextField 
                                size="small" label="Min" type="number" className="w-24"
                                value={mod.min ?? ''}
                                onChange={(e) => handleSkuModChange(sku, "min", e.target.value === '' ? undefined : e.target.value)}
                             />
                             <TextField 
                                size="small" label="Max (Opt)" type="number" className="w-24"
                                value={mod.max ?? ''}
                                onChange={(e) => handleSkuModChange(sku, "max", e.target.value === '' ? undefined : e.target.value)}
                             />
                             <FormControl size="small" className="w-32">
                                <Select
                                    value={mod.type}
                                    onChange={(e) => handleSkuModChange(sku, "type", e.target.value as ModifierType)}
                                >
                                    <MenuItem value="ADDITIVE">Additive</MenuItem>
                                    <MenuItem value="MULTIPLIER">Multiplier</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField 
                                size="small" label="Value" type="number" className="w-24"
                                value={mod.value ?? ''}
                                onChange={(e) => handleSkuModChange(sku, "value", e.target.value === '' ? undefined : e.target.value)}
                             />
                             <IconButton size="small" color="error" onClick={() => handleSkuModDelete(sku)}>
                                <Trash2 size={16} />
                             </IconButton>
                         </Box>
                    ))}
                    <Button variant="text" size="small" startIcon={<Plus size={16}/>} onClick={handleSkuModAdd}>
                        Add SKU Override
                    </Button>
                </Box>
            </CustomTabPanel>

            {/* Tab 2: SKU Conditions */}
            <CustomTabPanel value={tabIndex} index={2}>
                 <Box className="space-y-3">
                    <Typography variant="body2" className="text-gray-500 mb-2">Define minimum/maximum quantities of specific SKUs required to qualify for this slab.</Typography>
                    {slab.skuConditions && Object.entries(slab.skuConditions).map(([sku, cond]) => (
                         <Box key={sku} className="flex gap-3 items-center p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                             <TextField 
                                size="small" label="Required SKU Key" 
                                defaultValue={sku}
                                onBlur={(e) => handleSkuCondChange(sku, "key", e.target.value)}
                                className="w-48"
                             />
                             <TextField 
                                size="small" label="Min Quantity" type="number" className="w-32"
                                value={cond.min ?? ''}
                                onChange={(e) => handleSkuCondChange(sku, "min", e.target.value === '' ? undefined : e.target.value)}
                             />
                             <TextField 
                                size="small" label="Max Quantity (Opt)" type="number" className="w-32"
                                value={cond.max ?? ''}
                                onChange={(e) => handleSkuCondChange(sku, "max", e.target.value === '' ? undefined : e.target.value)}
                             />
                             <IconButton size="small" color="error" onClick={() => handleSkuCondDelete(sku)}>
                                <Trash2 size={16} />
                             </IconButton>
                         </Box>
                    ))}
                    <Button variant="text" size="small" startIcon={<Plus size={16}/>} onClick={handleSkuCondAdd}>
                        Add SKU Condition
                    </Button>
                </Box>
            </CustomTabPanel>
        </Box>
    );
};

const SchemeEngineConfig: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [payload, setPayload] = useState<SchemePayload>({
        condition: undefined,
        slabConfig: {
            type: "SCAN_COUNT",
            slabs: []
        }
    });

    const logout = async () => {
        try {
            await userLogout();
        } catch (err) {
            console.error("Logout API failed:", err);
        }
        dispatch(logoutUser());
        dispatch(clearTokens());
        navigate("/");
    };

    // Rule Engine Methods
    const handleRuleChange = (path: number[], newRule: Rule) => {
        if (path.length === 0) {
            setPayload({ ...payload, condition: newRule });
            return;
        }

        const updateNested = (currentRule: Rule, currentPath: number[]): Rule => {
            if (currentPath.length === 0) return newRule;
            if (isGroup(currentRule)) {
                const index = currentPath[0];
                const restPath = currentPath.slice(1);
                const newConditions = [...currentRule.conditions];
                if (restPath.length === 0) {
                     newConditions[index] = newRule;
                } else {
                     newConditions[index] = updateNested(newConditions[index], restPath);
                }
                return { ...currentRule, conditions: newConditions };
            }
            return currentRule;
        };

        if (payload.condition) {
             setPayload({ ...payload, condition: updateNested(payload.condition, path) });
        }
    };

    const handleRuleDelete = (path: number[]) => {
        if (path.length === 0) {
            setPayload({ ...payload, condition: undefined });
            return;
        }

        const deleteNested = (currentRule: Rule, currentPath: number[]): Rule => {
            if (isGroup(currentRule)) {
                const index = currentPath[0];
                const restPath = currentPath.slice(1);
                
                if (restPath.length === 0) {
                    return { ...currentRule, conditions: currentRule.conditions.filter((_, i) => i !== index) };
                }
                
                const newConditions = [...currentRule.conditions];
                newConditions[index] = deleteNested(newConditions[index], restPath);
                return { ...currentRule, conditions: newConditions };
            }
            return currentRule;
        };
        
        if (payload.condition) {
            setPayload({ ...payload, condition: deleteNested(payload.condition, path) });
        }
    };

    // Slab Methods
    const addSlab = () => {
        const newSlab: Slab = { id: generateId(), defaultModifier: { min: 1, type: "ADDITIVE", value: 1 } };
        setPayload({
            ...payload,
            slabConfig: { ...payload.slabConfig, slabs: [...payload.slabConfig.slabs, newSlab] }
        });
    };

    const updateSlab = (index: number, updatedSlab: Slab) => {
        const newSlabs = [...payload.slabConfig.slabs];
        newSlabs[index] = updatedSlab;
        setPayload({ ...payload, slabConfig: { ...payload.slabConfig, slabs: newSlabs } });
    };

    const deleteSlab = (index: number) => {
        setPayload({
            ...payload,
            slabConfig: { ...payload.slabConfig, slabs: payload.slabConfig.slabs.filter((_, i) => i !== index) }
        });
    };
    
    // JSON generation
    const getCleanPayload = () => {
        // Strip out React 'id' keys used for rendering before logging/submitting
        const cleanSlabs = payload.slabConfig.slabs.map(({id, ...rest}) => {
            const cleanMod = (mod?: SkuModifier) => {
                if (!mod) return mod;
                return {
                    ...mod,
                    min: mod.min !== undefined && mod.min !== '' ? Number(mod.min) : 0,
                    max: mod.max !== undefined && mod.max !== '' ? Number(mod.max) : undefined,
                    value: mod.value !== undefined && mod.value !== '' ? Number(mod.value) : 0,
                };
            };

            const cleanSkuMods = rest.skuModifiers ? Object.fromEntries(Object.entries(rest.skuModifiers).map(([k, v]) => [k, cleanMod(v)])) : undefined;
            const cleanSkuConds = rest.skuConditions ? Object.fromEntries(Object.entries(rest.skuConditions).map(([k, v]) => [k, { ...v, min: v.min !== undefined && v.min !== '' ? Number(v.min) : 0, max: v.max !== undefined && v.max !== '' ? Number(v.max) : undefined }])) : undefined;

            return {
                ...rest,
                defaultModifier: cleanMod(rest.defaultModifier),
                skuModifiers: cleanSkuMods,
                skuConditions: cleanSkuConds
            };
        });
        
        const cleanCondition = (rule: Rule): Rule => {
            if (isGroup(rule)) {
                return { ...rule, conditions: rule.conditions.map(cleanCondition) };
            } else {
                if (rule.operator === "IN" && typeof rule.value === "string") {
                    const cleanedStr = rule.value.replace(/^\[|\]$/g, '');
                    return { ...rule, value: cleanedStr.split(",").map(s => s.trim()).filter(s => s) };
                }
                return rule;
            }
        };

        return {
            ...payload,
            condition: payload.condition ? cleanCondition(payload.condition) : undefined,
            slabConfig: { ...payload.slabConfig, slabs: cleanSlabs }
        };
    };

    const isValid = payload.slabConfig.slabs.every(slab => {
        if (slab.defaultModifier) {
            if (slab.defaultModifier.value === undefined || slab.defaultModifier.value === null || slab.defaultModifier.min === undefined || slab.defaultModifier.min === null) return false;
        }
        return true;
    });

    return (
        <div className="h-screen overflow-hidden flex flex-col bg-gray-50/50">
            <TopBar logout={logout} />
            <div className="flex flex-1 overflow-hidden p-5 gap-6">
                
                {/* Left Side: Builder Panels */}
                <div className="flex-1 overflow-y-auto pr-2 pb-10">
                    
                    {/* Header */}
                    <Box className="flex items-center justify-between mb-6">
                        <Box>
                            <Typography variant="h5" className="font-bold text-gray-800 tracking-tight">Scheme Rules Engine</Typography>
                            <Typography variant="body2" className="text-gray-500">Visually build and configure scheme rules and slabs.</Typography>
                        </Box>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<Save size={18} />}
                            disabled={!isValid}
                            className="bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all"
                        >
                            Save Configuration
                        </Button>
                    </Box>

                    {/* Section 1: Conditions Builder */}
                    <Card className="mb-6 shadow-sm border border-gray-100 rounded-xl overflow-visible">
                        <Box className="p-4 bg-gradient-to-r from-indigo-50/50 to-white border-b border-indigo-100">
                            <Box className="flex items-center gap-2">
                                <Settings2 className="text-indigo-600" size={20} />
                                <Typography variant="subtitle1" className="font-semibold text-gray-800">Eligibility Conditions</Typography>
                            </Box>
                        </Box>
                        <CardContent className="bg-white">
                            {!payload.condition ? (
                                <Box className="text-center py-6">
                                    <Typography variant="body2" className="text-gray-400 mb-3">No eligibility conditions defined yet.</Typography>
                                    <Box className="flex justify-center gap-3">
                                        <Button variant="outlined" startIcon={<Plus size={16}/>} onClick={() => setPayload({ ...payload, condition: defaultRuleCondition })}>
                                            Add Single Rule
                                        </Button>
                                        <Button variant="outlined" startIcon={<Plus size={16}/>} onClick={() => setPayload({ ...payload, condition: defaultRuleGroup })}>
                                            Add Rule Group
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <ConditionNode 
                                    rule={payload.condition} 
                                    path={[]} 
                                    onChange={handleRuleChange} 
                                    onDelete={handleRuleDelete} 
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Section 2 & 3: Slab Configurations */}
                    <Card className="mb-6 shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                        <Box className="p-4 bg-gradient-to-r from-teal-50/50 to-white border-b border-teal-100 flex justify-between items-center">
                            <Box className="flex items-center gap-2">
                                <Settings2 className="text-teal-600" size={20} />
                                <Typography variant="subtitle1" className="font-semibold text-gray-800">Slab Configurations</Typography>
                            </Box>
                            
                            <FormControl size="small" className="min-w-[180px] bg-white rounded">
                                <Select
                                    value={payload.slabConfig.type}
                                    onChange={(e) => setPayload({ ...payload, slabConfig: { ...payload.slabConfig, type: e.target.value as "SCAN_COUNT" | "EARNED_POINTS" } })}
                                >
                                    <MenuItem value="SCAN_COUNT">By Scan Count</MenuItem>
                                    <MenuItem value="EARNED_POINTS">By Earned Points</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        
                        <CardContent className="p-4 bg-gray-50/30">
                            {payload.slabConfig.slabs.map((slab, index) => (
                                <Card key={slab.id} className="mb-4 border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                                    <Box className="p-3 bg-gray-100/50 flex justify-between items-center border-b border-gray-100">
                                        <Typography variant="subtitle2" className="font-semibold text-gray-700">Slab #{index + 1}</Typography>
                                        <IconButton size="small" color="error" onClick={() => deleteSlab(index)}>
                                            <Trash2 size={16} />
                                        </IconButton>
                                    </Box>
                                    <Box className="p-2">
                                        <SlabDetailEditor slab={slab} onUpdate={(s) => updateSlab(index, s)} />
                                    </Box>
                                </Card>
                            ))}

                            <Button variant="outlined" color="primary" startIcon={<Plus size={16}/>} onClick={addSlab} className="border-dashed border-2 py-2 mt-2 w-full max-w-[200px]">
                                Add New Slab
                            </Button>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Side: Live JSON Preview */}
                <div className="w-[450px] flex-shrink-0 flex flex-col h-[calc(100vh-100px)] bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-700">
                    <Box className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                        <Box className="flex items-center gap-2 text-slate-200">
                            <Code size={18} />
                            <Typography variant="subtitle2" className="font-mono text-sm tracking-widest text-emerald-400">PAYLOAD.JSON</Typography>
                        </Box>
                        <IconButton size="small" className="text-slate-400 hover:text-white" onClick={() => navigator.clipboard.writeText(JSON.stringify(getCleanPayload(), null, 2))}>
                            <Copy size={16} />
                        </IconButton>
                    </Box>
                    <Box className="flex-1 p-4 overflow-y-auto custom-scrollbar text-sm font-mono leading-relaxed text-indigo-300">
                        <pre className="whitespace-pre-wrap break-all">
                            {JSON.stringify(getCleanPayload(), null, 2)}
                        </pre>
                    </Box>
                </div>

            </div>
        </div>
    );
};

export default SchemeEngineConfig;
