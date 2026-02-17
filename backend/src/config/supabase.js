const buildHeaders = (base, extras) => {
  const headers = { ...base };
  for (const [key, value] of Object.entries(extras || {})) {
    if (value !== undefined && value !== null) {
      headers[key] = value;
    }
  }
  return headers;
};

const sanitizeValue = (value) => {
  if (value === null) {
    return "null";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return String(value);
};

const encodeInList = (values) => {
  return values.map((value) => sanitizeValue(value)).join(",");
};

class QueryBuilder {
  constructor(baseUrl, serviceRoleKey, table) {
    this.baseUrl = baseUrl;
    this.serviceRoleKey = serviceRoleKey;
    this.table = table;

    this.method = "GET";
    this.body = null;
    this.query = new URLSearchParams();
    this.preferParts = [];
    this.headers = {};
    this.expectSingle = false;
    this.expectMaybeSingle = false;
    this.returnRepresentation = false;
  }

  select(columns = "*") {
    this.query.set("select", columns);
    if (this.method !== "GET") {
      this.returnRepresentation = true;
    }
    return this;
  }

  insert(values) {
    this.method = "POST";
    this.body = values;
    return this;
  }

  update(values) {
    this.method = "PATCH";
    this.body = values;
    return this;
  }

  delete() {
    this.method = "DELETE";
    return this;
  }

  upsert(values, options = {}) {
    this.method = "POST";
    this.body = values;
    this.preferParts.push("resolution=merge-duplicates");
    if (options.onConflict) {
      this.query.set("on_conflict", options.onConflict);
    }
    return this;
  }

  eq(field, value) {
    this.query.append(field, `eq.${sanitizeValue(value)}`);
    return this;
  }

  neq(field, value) {
    this.query.append(field, `neq.${sanitizeValue(value)}`);
    return this;
  }

  gte(field, value) {
    this.query.append(field, `gte.${sanitizeValue(value)}`);
    return this;
  }

  lt(field, value) {
    this.query.append(field, `lt.${sanitizeValue(value)}`);
    return this;
  }

  is(field, value) {
    this.query.append(field, `is.${sanitizeValue(value)}`);
    return this;
  }

  in(field, values) {
    this.query.append(field, `in.(${encodeInList(values || [])})`);
    return this;
  }

  order(field, options = {}) {
    const direction = options.ascending === false ? "desc" : "asc";
    this.query.set("order", `${field}.${direction}`);
    return this;
  }

  limit(count) {
    this.query.set("limit", String(count));
    return this;
  }

  single() {
    this.expectSingle = true;
    return this;
  }

  maybeSingle() {
    this.expectMaybeSingle = true;
    return this;
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }

  catch(reject) {
    return this.execute().catch(reject);
  }

  async execute() {
    const queryString = this.query.toString();
    const url = `${this.baseUrl}/rest/v1/${encodeURIComponent(this.table)}${
      queryString ? `?${queryString}` : ""
    }`;

    if (this.method !== "GET") {
      this.preferParts.push(
        this.returnRepresentation ? "return=representation" : "return=minimal"
      );
    }

    const headers = buildHeaders(
      {
        apikey: this.serviceRoleKey,
        Authorization: `Bearer ${this.serviceRoleKey}`,
      },
      {
        "Content-Type": this.body ? "application/json" : undefined,
        Accept:
          this.expectSingle || this.expectMaybeSingle
            ? "application/vnd.pgrst.object+json"
            : "application/json",
        Prefer: this.preferParts.length > 0 ? this.preferParts.join(",") : undefined,
        ...this.headers,
      }
    );

    const response = await fetch(url, {
      method: this.method,
      headers,
      body: this.body ? JSON.stringify(this.body) : undefined,
    });

    const raw = await response.text();
    const parsed = raw ? safeJsonParse(raw) : null;

    if (!response.ok) {
      if (
        this.expectMaybeSingle &&
        response.status === 406 &&
        parsed &&
        parsed.code === "PGRST116"
      ) {
        return { data: null, error: null };
      }

      return {
        data: null,
        error: {
          message: parsed?.message || response.statusText || "Request failed",
          details: parsed?.details,
          hint: parsed?.hint,
          code: parsed?.code,
          status: response.status,
        },
      };
    }

    return {
      data: parsed,
      error: null,
    };
  }
}

const safeJsonParse = (input) => {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
};

const createSupabaseRestClient = (supabaseUrl, supabaseServiceRoleKey) => {
  return {
    from(table) {
      return new QueryBuilder(supabaseUrl, supabaseServiceRoleKey, table);
    },
  };
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createSupabaseRestClient(supabaseUrl, supabaseServiceRoleKey)
    : null;

const ensureSupabaseConfigured = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }
};

module.exports = {
  supabase,
  ensureSupabaseConfigured,
  createSupabaseRestClient,
};
