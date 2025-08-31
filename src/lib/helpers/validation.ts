export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const validateWorkflowSteps = (steps: any[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  steps.forEach((step, stepIndex) => {
    if (!step.primaryPerformer) {
      errors.push(`Step ${stepIndex + 1}: Primary performer is required`);
    } else if (!isValidEthereumAddress(step.primaryPerformer)) {
      errors.push(`Step ${stepIndex + 1}: Primary performer must be a valid Ethereum address`);
    }
    
    if (!step.instructions.trim()) {
      errors.push(`Step ${stepIndex + 1}: Instructions are required`);
    }
    
    const totalSubSplit = step.subPerformers.reduce((total: number, sub: any) => total + sub.splitBasisPoints, 0);
    
    if (totalSubSplit > 10000) {
      errors.push(`Step ${stepIndex + 1}: Sub-performer splits exceed 100% (${(totalSubSplit / 100).toFixed(2)}%)`);
    }
    
    step.subPerformers.forEach((sub: any, subIndex: number) => {
      if (sub.splitBasisPoints > 0) {
        if (!sub.performer) {
          errors.push(`Step ${stepIndex + 1}, Sub-performer ${subIndex + 1}: Address is required`);
        } else if (!isValidEthereumAddress(sub.performer)) {
          errors.push(`Step ${stepIndex + 1}, Sub-performer ${subIndex + 1}: Must be a valid Ethereum address`);
        }
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};