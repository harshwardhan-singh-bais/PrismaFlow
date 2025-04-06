// You can improve this basic mock
export function parsePrismaSchema(schema: string) {
    const modelRegex = /model (\w+) \{([^}]+)\}/g;
    const models: Record<string, string[]> = {};
    const relations: { from: string; to: string; label: string }[] = [];
  
    let match;
    while ((match = modelRegex.exec(schema))) {
      const modelName = match[1];
      const body = match[2];
      const fields = body
        .split("\n")
        .map(line => line.trim())
        .filter(line => line && !line.startsWith("//"));
  
      models[modelName] = fields;
  
      fields.forEach(field => {
        const parts = field.split(/\s+/);
        const fieldName = parts[0];
        const typeName = parts[1];
  
        if (models[typeName]) {
          relations.push({
            from: modelName,
            to: typeName,
            label: fieldName,
          });
        }
      });
    }
  
    return { models, relations };
  }
  