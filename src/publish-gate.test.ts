import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
	applyVersion,
	bumpPatch,
	compareSemver,
	nextPublishVersion,
} from "../scripts/publish-gate.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("publish-gate", () => {
	it("orders semver", () => {
		expect(compareSemver("0.1.2", "0.1.2")).toBe(0);
		expect(compareSemver("0.1.3", "0.1.2")).toBe(1);
		expect(compareSemver("0.1.2", "0.1.4")).toBe(-1);
		expect(compareSemver("0.2.0", "0.1.9")).toBe(1);
	});

	it("bumps only when local is not ahead", () => {
		expect(nextPublishVersion("0.1.4", null)).toBe(null);
		expect(nextPublishVersion("0.1.4", "0.1.2")).toBe(null);
		expect(nextPublishVersion("0.1.4", "0.1.4")).toBe("0.1.5");
		expect(nextPublishVersion("0.1.3", "0.1.4")).toBe("0.1.5");
		expect(bumpPatch("1.0.0")).toBe("1.0.1");
	});

	it("keeps package.json formatting", () => {
		const raw = '{\n\t"name": "pkg",\n\t"version": "0.1.4",\n}\n';
		expect(applyVersion(raw, "0.1.5")).toBe(
			'{\n\t"name": "pkg",\n\t"version": "0.1.5",\n}\n',
		);
	});

	it("hooks prepublishOnly", () => {
		const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
		expect(pkg.scripts.prepublishOnly).toMatch(/publish-gate/);
	});
});
